import tasks from '../models/taskSchema.js';
import ListT from '../models/listSchema.js';

export const getTasks = async (req, res) => {
    try {
        const taskType = req.params.id;
        const ListId = req.params.listId;
        let query = { user: req.user._id };
        if (taskType === 'todayTasks') {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            query = {
                ...query,
                dueDate: { $gte: startOfToday, $lte: endOfToday },
            };
        } else if (taskType === 'upcomingTasks') {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            query = {
                ...query,
                dueDate: { $gt: startOfToday },
            };
        } else if (taskType === 'completedTasks') {
            query = {
                ...query,
                isCompleted: true,
            };
        } else if (taskType === 'expiredTasks') {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);
            query = {
                ...query,
                dueDate: { $lt: startOfToday },
                isCompleted: false,
            };
        } else if (taskType === 'list') {
            query = {
                ...query,
                lists: { $in: [ListId] },
            };
        }

        const allTasks = await tasks.find(query).exec();
        const taskListIds = allTasks.map(task => task.lists).flat();

        // Only look up lists if the task list is not empty
        let lists = [];
        if (taskListIds.length > 0) {
            lists = await ListT.find({ _id: { $in: taskListIds } }, { listName: 1, color: 1 }).exec();
        }

        const tasksWithListDetails = allTasks.map(task => {
            // Only add list details if the task has lists
            if (task.lists.length > 0) {
                const listDetails = task.lists.map(listId => {
                    const list = lists.find(list => list._id.toString() === listId);
                    if (list)
                        return {
                            listId: list._id,
                            listName: list.listName,
                            color: list.color
                        }
                    else return {
                        listId: '',
                        listName: '',
                        color: ''
                    };
                });
                return { ...task._doc, lists: listDetails };
            } else {
                return task;
            }
        });
        res.status(200).json(tasksWithListDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting tasks' });
    }
};

export const addTasks = async (req, res) => {
    try {
        const task = new tasks({
            user: req.user._id,
            taskName: req.body.taskName,
            title: req.body.title,
            description: req.body.description,
            dateCreated: new Date(),
            dueDate: req.body.dueDate,
            lists: req.body.lists,
            isCompleted: false
        });
        await task.save();
        res.status(201).json({ jsonTask: task, message: 'Task created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating a task' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const user = req.user;
        const taskId = req.params.id;
        const updatedTask = req.body;
        console.log("here:" + updatedTask)
        const task = await tasks.findOneAndUpdate(
            { _id: taskId, user: user._id },
            { ...updatedTask },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ jsonTask: task, message: 'Task updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating a task' });
    }
};


export const completeTask = async (req, res) => {
    try {
        const task = await tasks.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updatedTask = await tasks.findByIdAndUpdate(
            req.params.id,
            { $set: { isCompleted: !task.isCompleted } },
            { new: true }
        );

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteTask = async (req, res) => {
    const result = await tasks.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
};