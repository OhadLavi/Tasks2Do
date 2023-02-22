import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { addTask } from '../../components/utils/taskFunctions';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AddTaskPage = () => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskLists, setTaskLists] = useState([]);
    const [availableTasksLists, setAvailableTasksLists] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [finishedShowingAlert, setFinishedShowingAlert] = useState(false);
    const [tasks, setTasks] = useState([]);
    let alertMessage = {};
    const navigate = useNavigate();
    let config = "";

    useEffect(() => {
        if (!localStorage.getItem("authToken")) {
            navigate("/login");
        }
        else {
            config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
            };
        }
    }, [finishedShowingAlert]);

    const showAlert = (alertDetails) => {
        setAlert(alertDetails);
        setTimeout(() => {
            setAlert({ message: '', type: '' });
            setFinishedShowingAlert(!finishedShowingAlert);
        }, 5000);
    };

    useEffect(() => {
        try {
            axios.get("/api/lists/getLists", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                }
            })
                .then((res) => {
                    setAvailableTasksLists(res.data);
                })
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                showAlert({ message: error.response.data.message, type: 'danger' });
            } else {
                showAlert({ message: error.message, type: 'danger' });
            }
        }
    }, []);

    const addTaskAndUpdateState = async (event) => {
        event.preventDefault();
        try {
            const response = await addTask(taskName, taskDescription, taskDueDate, taskLists);
            showAlert({ message: response.message, type: 'success' });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                showAlert({ message: error.message + ": " + error.response.data.message, type: 'danger' });
            } else {
                showAlert({ message: error.message, type: 'danger' });
            }
        }
        setTaskName("");
        setTaskDescription("");
        setTaskDueDate("");
        setTaskLists([]);
    };

    return (
        <div className="taskSideBarMain" style={{ minWidth: '200px' }}>
            <div className="taskSideBarHeader">
                <h1>Add a New Task</h1>
            </div>
            {alert.message && (
                <div className="alert-helper">
                    <Alert variant={alert.type} className="mt-3 w-100 d-flex">
                        {alert.message}
                        <div className="spinner"></div>
                    </Alert>

                </div>
            )}
            <Form onSubmit={addTaskAndUpdateState}>
                <Form.Group controlId="formTaskName" className="my-3">
                    <Form.Label>Task name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter a task name"
                        value={taskName}
                        onChange={(event) => { setTaskName(event.target.value); }}
                        className="bg-dark text-white"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formTaskDescription" className="my-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Description"
                        value={taskDescription ? taskDescription : ''}
                        onChange={(event) => { setTaskDescription(event.target.value); }}
                        className="bg-dark text-white"
                    />
                </Form.Group>

                <Form.Group controlId="formTaskDueDate" className="my-3">
                    <Form.Label>Due date</Form.Label>
                    <Form.Control
                        type="date"
                        placeholder="dd-mm-yyyy"
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
                                    <option key={list._id} value={list._id}>
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
};

export default AddTaskPage;
