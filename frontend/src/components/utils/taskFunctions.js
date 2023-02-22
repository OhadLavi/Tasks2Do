import axios from 'axios';

export const completeTask = async (id, config) => {
    const response = await axios.put(`/api/tasks/completeTask/${id}`, config);
    return response.data;
};

export const deleteTask = async (id, config) => {
    const response = await axios.delete(`/api/tasks/deleteTask/${id}`, { withCredentials: true });
    return response.data;
};

export const addTask = async (taskName, taskDescription, taskDueDate, taskLists) => {
    const response = await axios.post(
        '/api/tasks/addTasks',
        {
            taskName: taskName,
            description: taskDescription,
            dateCreated: new Date(),
            dueDate: taskDueDate ? taskDueDate : new Date(),
            lists: taskLists ? taskLists : [],
            isCompleted: false
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            }
        }
    );
    return response.data;
};

export const updateTask = async (task, taskName, taskDescription, taskDueDate, taskLists) => {
    // Check if the taskLists array contains an empty string
    const emptyStringIndex = taskLists.indexOf("");
    let hasEmptyString = false;
    if (emptyStringIndex !== -1) {
        if (taskLists.length > 1) {
            taskLists.splice(emptyStringIndex, 1);
        } else {
            hasEmptyString = true;
        }
    }
    try {
        const response = await axios.put(`/api/tasks/updateTask/${task._id}`,
            {
                taskName: taskName ? taskName : task ? task.taskName : '',
                description: taskDescription ? taskDescription : task ? task.description : '',
                dueDate: taskDueDate ? taskDueDate : task ? task.taskDueDate : '',
                lists: hasEmptyString ? [] : taskLists,
                isCompleted: false
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error(error.message);
        }
    }
};