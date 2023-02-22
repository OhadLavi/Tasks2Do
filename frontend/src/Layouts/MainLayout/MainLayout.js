import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from '../../components/SideBar/SideBar'
import { Outlet } from "react-router-dom";
import './MainLayout.css';

const Layout = () => {
    return (
        <div className="d-flex main h-100">
            <div className="flex-shrink-0 h-100">
                <Sidebar />
            </div>
            <div className="flex-grow-1 px-3 px-md-4 px-lg-5">
                <Container fluid>
                    <Row>
                        <Col xs={12} md={12} lg={12}>
                            <Outlet />
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Layout;
