import React, { useEffect, useState } from 'react'
import { Navbar, NavDropdown, Nav, Container, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useLocalStorage, refreshToken } from '../utils';

const Navigation = () => {
    const navigate = useNavigate()
    const [name, setName] = useLocalStorage('name', '')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    useEffect(() => {
        refreshToken(setToken, setName, setExpire, navigate)
    }, [])
    const logout = () => {
        Swal.fire({
            title: 'Logout',
            text: "Are you sure you want to log out?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('http://localhost:5000/logout')
                navigate('/')
                localStorage.clear()
            }
        })
    }
    return (
        <Navbar bg="dark" expand="lg" w="100" variant="dark">
            <Container>
                <Navbar.Brand href="/products"><img src={process.env.PUBLIC_URL + "logo514.png"} width="30" height="30" className="d-inline-block align-top" /> Botwin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto d-flex align-items-sm-center">
                        {/* <Link to='/add' style={{ marginRight: '15px' }} className="text-white">Chain Management</Link> */}
                        <Navbar.Brand style={{ fontSize: '15px', marginTop: '2px' }}>{name}</Navbar.Brand>
                        <Button variant="dark" onClick={logout} className="fa fa-sign-out"> Logout</Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation