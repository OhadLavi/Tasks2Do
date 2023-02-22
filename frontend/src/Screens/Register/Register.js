import React, { useState, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import './Register.css';
import axios from 'axios';

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const formRef = useRef(null);

    const clearError = (fieldName) => {
        if (!!errors[fieldName]) {
            setErrors({ ...errors, [fieldName]: null, });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!name || name === '' || !name.match(/^[a-zA-Z]+$/) || name.length < 1) newErrors.name = "Please provide valid name";
        if (!email || email === '') newErrors.email = "Please provide valid email";
        if (!password || password === '') newErrors.password = "Please provide valid password";
        else if (password.length < 4) newErrors.password = "The password must contains atleast 4 characters";
        if (!passwordConfirmation || passwordConfirmation === '') newErrors.passwordConfirmation = "Please provide valid password confirmation";
        if (password && passwordConfirmation && password != passwordConfirmation) newErrors.passwordConfirmation = "The confirmation password does not match";
        return newErrors;
    }

    const handleSubmitRegister = async (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        }
        else {
            const data = { name, email, password };
            await axios.post('/api/users/register', data, { withCredentials: true })
                .then((response) => {
                    formRef.current.reset();
                    setName("");
                    setEmail("");
                    setPassword("");
                    setPasswordConfirmation("");
                    setAlert({ message: response.data.message, type: 'success' });
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.message) {
                        setAlert({ message: error.response.data.message, type: 'danger' });
                    } else {
                        setAlert({ message: error.message, type: 'danger' });
                    }
                });
        };
    }

    return (
        <div className="login-register-main">
            <Container className="shadow my-5">
                <Row className="no-gutters h-700">
                    <Col md={6}>
                        <Col md={12} className="h-100 d-flex flex-column bg-black align-items-center text-white justify-content-center form border blackBorder rounded-4">
                            <div className="inner text-center">
                                <h1 className="display-4 fw-bolder">Hello there</h1>
                                <p className="lead text-center">Enter your details to sign up</p>
                                <h5 className="mb-4">OR</h5>
                                <NavLink to="/Login" className="btn btnColor rounderd-pill pb-2 w-50 text-white">Sign in</NavLink>
                            </div>
                        </Col>
                    </Col>
                    <Col md={6} className="mt-3 mt-md-0">
                        <Col md={12} className="h-100 p-5 d-flex flex-column justify-content-center border whiteBorder rounded-4 ">
                            <div className="inner">
                                <h1 className="display-6 fw-bolder mb-3 text-white">Sign up</h1>
                                <Form ref={formRef} onSubmit={handleSubmitRegister}>
                                    <Form.Group controlId="nameInput" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            value={name}
                                            onChange={(event) => {
                                                setName(event.target.value);
                                                clearError('name');
                                            }}
                                            isInvalid={!!errors.name}
                                            placeholder="Name"
                                            className="bg-dark text-white" />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="emailInput" className="mb-3">
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(event) => {
                                                setEmail(event.target.value);
                                                clearError('email');
                                            }}
                                            isInvalid={!!errors.email}
                                            placeholder="Email"
                                            className="bg-dark text-white" />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="passwordInput" className="mb-3">
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                                clearError('password');
                                            }}
                                            isInvalid={!!errors.password}
                                            placeholder="Password"
                                            className="bg-dark text-white" />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="confirmPasswordInput" className="mb-3">
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordConfirmation}
                                            onChange={(event) => {
                                                setPasswordConfirmation(event.target.value);
                                                clearError('passwordConfirmation');
                                            }}
                                            isInvalid={!!errors.passwordConfirmation}
                                            placeholder="Confirm password"
                                            className="bg-dark text-white" />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.passwordConfirmation}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit" className="btn-primary btn-block w-100">Sign up</Button>
                                </Form>
                                {alert.message && (
                                    <Alert className="mt-3" variant={alert.type}>
                                        {alert.message}
                                    </Alert>
                                )}
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SignUpPage;