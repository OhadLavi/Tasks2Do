import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Login.css';

const LoginPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const clearError = (fieldName) => {
    if (!!errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email || email === '') newErrors.email = 'Please provide valid email';
    if (!password || password === '')
      newErrors.password = 'Please provide valid password';
    return newErrors;
  };

  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      await axios
        .post(
          '/api/users/login',
          { email, password },
          { withCredentials: true }
        )
        .then((response) => {
          localStorage.setItem('authToken', response.data.token);
          navigate('/');
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            setAlert({ message: error.response.data.message, type: 'danger' });
          } else {
            setAlert({ message: error.message, type: 'danger' });
          }
          console.error(error);
        });
    }
  };

  return (
    <div className='login-register-main'>
      <Container className='shadow my-5'>
        <Row className='no-gutters h-700'>
          <Col md={6}>
            <Col
              md={12}
              className='h-100 d-flex flex-column bg-black align-items-center text-white justify-content-center form border blackBorder rounded-4'
            >
              <div className='inner text-center'>
                <h1 className='display-4 fw-bolder'>Welcome</h1>
                <p className='lead text-center'>
                  Enter your credentials to login
                </p>
                <h5 className='mb-4'>OR</h5>
                <NavLink
                  to='/Register'
                  className='btn btnColor rounderd-pill pb-2 w-50 text-white'
                >
                  Register
                </NavLink>
              </div>
            </Col>
          </Col>
          <Col md={6} className='mt-3 mt-md-0'>
            <Col
              md={12}
              className='h-100 p-5 d-flex flex-column justify-content-center border whiteBorder rounded-4 '
            >
              <div className='inner'>
                <h1 className='display-6 fw-bolder mb-3 text-white'>Login</h1>
                <Form onSubmit={handleSubmitLogin}>
                  <Form.Group controlId='email' className='mb-3'>
                    <Form.Control
                      type='email'
                      placeholder='Email'
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        clearError('email');
                      }}
                      isInvalid={!!errors.email}
                      className='bg-dark text-white'
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId='password' className='mb-3'>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        clearError('password');
                      }}
                      isInvalid={!!errors.password}
                      className='bg-dark text-white'
                    />
                    <Form.Control.Feedback type='invalid'>
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className='mb-3'>
                    <Button
                      variant='primary'
                      type='submit'
                      className='w-100'
                      block
                    >
                      Sign in
                    </Button>
                  </div>
                </Form>
                {alert.message && (
                  <Alert className='mt-3' variant={alert.type}>
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

export default LoginPage;
