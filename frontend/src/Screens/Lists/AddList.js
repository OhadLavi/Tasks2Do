import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddList.css';

const AddListPage = () => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#ffffff');
    const [alert, setAlert] = useState({ message: '', type: '' });
    const navigate = useNavigate();
    let config = "";

    const showAlert = (alertDetails, link) => {
        setAlert(alertDetails);
        setTimeout(() => {
            setAlert({ message: '', type: '' });
            navigate(link);
        }, 2500);
    };

    const handleClose = () => {
        navigate("/");
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
    });

    const addList = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                '/api/lists/addList',
                {
                    listName: name,
                    color: color,
                },
                config
            );
            showAlert({ message: response.data.message, type: 'success' }, response.data.jsonList.listName + "/" + response.data.jsonList._id);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                showAlert({ message: error.response.data.message, type: 'danger' });
            } else {
                showAlert({ message: error.message, type: 'danger' });
            }
        }
    };

    return (
        <Modal show={true} onHide={handleClose} variant="dark">
            <Modal.Header closeButton className="my-modal-header">
                <Modal.Title>Add a New List</Modal.Title>
            </Modal.Header>
            <Modal.Body className="my-modal-body">
                {alert.message && (
                    <div className="alert-helper">
                        <Alert variant={alert.type} className="mt-3 w-100 d-flex">
                            {alert.message}
                            <div className="spinner"></div>
                        </Alert>

                    </div>
                )}
                <Form onSubmit={addList}>
                    <Form.Group controlId="name">
                        <Form.Label>List Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(event) => { setName(event.target.value) }}
                            placeholder="Enter a name for the new list"
                            className="bg-dark text-white"
                        />
                    </Form.Group>
                    <Form.Group controlId="color" className="mt-2">
                        <Form.Label>List Color</Form.Label>
                        <Form.Control
                            type="color"
                            value={color}
                            onChange={(event) => { setColor(event.target.value) }}
                            className="bg-dark"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="my-modal-footer">
                <Button variant="primary" type="submit" onClick={addList}>
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddListPage;
