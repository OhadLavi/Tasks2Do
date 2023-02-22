import React, { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPlus, faCalendarTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import EditTaskSideBar from '../../components/EditTaskSideBar/EditTaskSideBar';
import { completeTask, deleteTask, addTask } from '../../components/utils/taskFunctions';
import axios from 'axios';
import "./Tasks.css"

const TodayPage = () => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState(new Date);
    const [taskLists, setTaskLists] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [tasks, setTasks] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [title, setTitle] = useState("");
    const [allowAddintTask, setAllowAddintTask] = useState(false);
    const [finishedShowingAlert, setFinishedShowingAlert] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    let taskUpdated = false;
    let config = "";

    const showAlert = (alertDetails) => {
        setAlert(alertDetails);
        setTimeout(() => {
            setAlert({ message: '', type: '' });
            setFinishedShowingAlert(!finishedShowingAlert);
        }, 5000);
    };

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setIsSidebarOpen(true);
    };

    const handleSidebarClose = (newAlert) => {
        setIsSidebarOpen(false);
        showAlert(newAlert);
    };

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
        setIsSidebarOpen(false);
        setAlert('', '');
        taskUpdated = false;
        let type, listName;

        if (params.list) {
            type = 'list';
            listName = params.type;
            setTitle("List " + params.name);
            setTaskLists([params.type]);
            setAllowAddintTask(true);
        }
        else {
            type = params.type;
            const taskType = type.slice(0, 1).toUpperCase() + type.slice(1, -5) + " Tasks";
            if (type === "todayTasks" || type === "upcomingTasks") {
                setAllowAddintTask(true);
            } else if (type === "completedTasks" || type === "expiredTasks") {
                setAllowAddintTask(false);
            } else {
                setTitle("Error, page not found.");
                return;
            }
            setTitle(taskType);
        }
        axios
            .get(`/api/tasks/getTasks/${type}/${listName}`, config)
            .then((res) => { setTasks(res.data); })
            .catch((err) => { setTasks([]); });

    }, [params.type, finishedShowingAlert]);

    const completeTaskAndUpdateState = async (id) => {
        const updatedTask = await completeTask(id, config);
        setTasks(tasks => tasks.map(task => {
            if (task._id === updatedTask._id) {
                task.isCompleted = updatedTask.isCompleted;
            }
            return task;
        }));
    };

    const deleteTaskAndUpdateState = async (id) => {
        const response = await deleteTask(id, config);
        setTasks(tasks => tasks.filter(task => task._id !== id));
        showAlert({ message: response.message, type: 'success' });
    };

    const addTaskAndUpdateState = async (event) => {
        event.preventDefault();
        try {
            const response = await addTask(taskName, taskDescription, taskDueDate, taskLists);
            setTasks([...tasks, response.jsonTask]);
            showAlert({ message: response.message, type: 'success' });
            setTaskName("");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                showAlert({ message: error.message + ": " + error.response.data.message, type: 'danger' });
            } else {
                showAlert({ message: error.message, type: 'danger' });
            }
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col xs={12} md={12} lg={isSidebarOpen ? 8 : 12}>
                    <h1 className="pb-3">{title}</h1>
                    {alert.message && (
                        <div className="alert-helper">
                            <Alert variant={alert.type} className="mt-3 w-100 d-flex">
                                {alert.message}
                                <div className="spinner"></div>
                            </Alert>

                        </div>
                    )}
                    {allowAddintTask && (
                        <Form onSubmit={addTaskAndUpdateState}>
                            <Form.Group className="input-group w-100 min-width" style={{ minWidth: '100px' }}>
                                <Form.Control type="text" placeholder="Add a new task" className="bg-dark text-white inputAdd" value={taskName} onChange={(event) => setTaskName(event.target.value)} required />
                                <Button variant="outline-secondary" type="submit" className="border-white btnPlus text-white">
                                    <FontAwesomeIcon icon={faPlus} />
                                </Button>
                            </Form.Group>
                        </Form>
                    )}
                    {tasks.length < 1 ? (<h3 className="pt-3">There are no tasks here...</h3>) : ''}
                    {tasks.length > 0 && (
                        <Table className="table-responsive w-auto bg-transparent text-color" style={{ borderCollapse: 'separate', borderSpacing: '0 15px' }}>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task._id} className="align-items-center">
                                        <td>
                                            <Form.Check type="checkbox" checked={task.isCompleted} className="form-check-input bg-transparent no-border mt-0" onChange={() => completeTaskAndUpdateState(task._id)} />
                                        </td>
                                        <td className="w-100" colSpan="2">
                                            <Form.Label className={"ms-2 text-left mb-0" + (task.isCompleted ? " taskCompleted" : "")}><h5>{task.taskName}</h5></Form.Label>
                                            {task.description && (
                                                <Form.Label className={"ms-2 text-left mb-0 d-block" + (task.isCompleted ? " taskCompleted" : "")}>{task.description}</Form.Label>
                                            )}
                                            <div className="mt-1" style={{ minWidth: '123px' }}>
                                                {task.dueDate && (
                                                    <>
                                                        <FontAwesomeIcon icon={faCalendarTimes} color="white" className="ms-2 me-1" />
                                                        <Form.Label className="ms-2 text-left me-2 mb-0">{new Date(task.dueDate).toLocaleDateString("fr-BE")}</Form.Label>
                                                    </>
                                                )}
                                                {task.lists && task.lists.length > 0 && (
                                                    <>
                                                        {task.dueDate && <span className="ms-2 me-1 tt">|</span>}
                                                        {task.lists.map((list, index) => (
                                                            <React.Fragment key={index}>
                                                                <Form.Label className="ms-2 text-left mb-0">
                                                                    <div className="ms-1 me-2 list-box" style={{ backgroundColor: list.color }}></div>
                                                                    {list.listName}
                                                                </Form.Label>
                                                                {index !== task.lists.length - 1 && <span className="ms-3 me-1 tt">|</span>}
                                                            </React.Fragment>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td colSpan="2">
                                            <Button variant="link" className="p-0" onClick={() => handleEditClick(task)}>
                                                <FontAwesomeIcon icon={faEdit} color="white" />
                                            </Button>
                                        </td>
                                        <td colSpan="2">
                                            <Button variant="link" className="p-0" onClick={() => deleteTaskAndUpdateState(task._id)}>
                                                <FontAwesomeIcon icon={faTrash} className="btnTrash" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
                <Col xs={12} md={12} lg={isSidebarOpen ? 4 : 12} className={"mb-3 mb-lg-0" + (isSidebarOpen ? " sidebar" : " d-none")}>
                    <EditTaskSideBar
                        task={selectedTask}
                        isSidebarOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        handleSidebarClose={handleSidebarClose}
                        taskUpdated={taskUpdated}
                    />
                </Col>
            </Row>
        </Container>
    )
};

export default TodayPage;
