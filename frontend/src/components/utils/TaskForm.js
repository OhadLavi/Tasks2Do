import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';

function TaskForm(props) {
    const {
        taskName,
        setTaskName,
        taskDescription,
        setTaskDescription,
        taskDueDate,
        setTaskDueDate,
        availableTasksLists,
        task,
        setTaskLists,
        updateTask,
        onClose,
        title,
        state,
    } = props;

    return (
        <div className={state ? "taskSideBarMain" : ""} style={{ minWidth: '200px' }}>
            <div className="taskSideBarHeader">
                <h1>{title}</h1>
                {state && (
                <Button className="closeButton" onClick={onClose ? onClose : ''}>
                    <FaTimes />
                </Button>
                )}
            </div>
            <Form onSubmit={updateTask}>
                <Form.Group controlId="formTaskName" className="my-3">
                    <Form.Label>Task name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter a task name"
                        value={taskName ? taskName : task ? task.taskName : ''}
                        onChange={(event) => {
                            setTaskName(event.target.value);
                            if (event.target.value === '') {
                                task.taskName = '';
                            }
                        }}
                        className="bg-dark text-white"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formTaskDescription" className="my-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Description"
                        value={taskDescription ? taskDescription : task ? task.description : ''}
                        onChange={(event) => {
                            setTaskDescription(event.target.value);
                            if (event.target.value === '') {
                                task.description = '';
                            }
                        }}
                        className="bg-dark text-white"
                    />
                </Form.Group>

                <Form.Group controlId="formTaskDueDate" className="my-3">
                    <Form.Label>Due date</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="dd-mm-yyyy"
                        value={
                            taskDueDate
                                ? taskDueDate
                                : task
                                    ? new Date(task.dueDate).toLocaleDateString("sv-SE")
                                    : ''
                        }
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(event) => { setTaskDueDate(event.target.value); }}
                        className="bg-dark text-white text-start"
                    />
                </Form.Group>

                <Form.Group controlId="formTaskLists" className="my-3">
                    <Form.Label>Lists</Form.Label>
                    <Form.Select
                        style={{ height: availableTasksLists.length > 5 ? '144px' : availableTasksLists.length > 0 ? `${19 + availableTasksLists.length * 24}px` : `29px` }}
                        multiple
                        size={availableTasksLists.length > 5 ? 5 : availableTasksLists.length}
                        onChange={(event) => { setTaskLists(Array.from(event.target.selectedOptions, option => option.value)); }}
                        className="bg-dark text-white custom-scrollbar"
                    >
                        <option></option>
                        {availableTasksLists ? (
                            availableTasksLists.length > 0 ? (
                                availableTasksLists.map(list => (
                                    <option key={list._id} value={list._id} selected={
                                        list._id &&
                                        task &&
                                        task.lists &&
                                        task.lists.some((taskList) => taskList.listId === list._id)
                                    }>
                                        {list.listName}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No available lists</option>
                            )
                        ) : (
                            <option disabled>Loading lists...</option>
                        )}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 my-3">
                    Save Changes
                </Button>
            </Form>
        </div>
    );
}

export default TaskForm;
