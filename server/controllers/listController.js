import ListT from '../models/listSchema.js';

export const getLists = async (req, res) => {
    try {
        const lists = await ListT.find({ user: req.user._id }).exec();
        res.status(200).json(lists);
    }
    catch (err) {
        res.status(500).json({ message: 'Error retrieving lists' });
        console.error(err);
    }
};

export const addList = async (req, res) => {
    try {
        const user = req.user;
        const list = new ListT({
            user: req.user._id,
            listName: req.body.listName,
            color: req.body.color,
        });
        const savedList = await list.save();
        res.status(201).json({ jsonList: savedList, message: 'List added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding a list' });
    }
};

export const deleteList = async (req, res) => {
    const result = await ListT.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'List deleted successfully' });
};