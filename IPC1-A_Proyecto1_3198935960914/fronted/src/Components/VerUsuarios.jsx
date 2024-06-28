import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const VerUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [validarEliminacion, setValidarEliminacion] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/students`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                setUsers(res);
            })
            .catch((error) => console.error(error));
    }, [validarEliminacion]);

    const deleteUser = (idUser) => {
        fetch(`http://localhost:5000/students/${idUser}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(res => {
                Swal.fire({
                    title: 'Delete User!',
                    text: `${res.mensaje}`,
                    icon: 'info',
                    confirmButtonText: 'Ok'
                });
                setValidarEliminacion(!validarEliminacion);
            })
            .catch(error => console.error("Error al eliminar el usuario:", error));
    };

    const viewUser = (user) => {
        setSelectedUser(user);
    };

    const handleClose = () => {
        setSelectedUser(null);
    };

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <Fragment>
            <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "100%", top: "0", backgroundColor: "#212529" }}>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, paddingLeft: "5%" }}>
                    <ul style={{ listStyleType: "none", display: "flex", padding: 0, height: "100%", alignItems: "center", margin: "0px" }}>
                        <li style={{ color: "white", marginRight: "15px" }}>
                            <Link style={{ color: "white", textDecoration: "none" }} to="/userAdmin">
                                Movies
                            </Link>
                        </li>
                        <li style={{ color: "white", marginRight: "15px" }}>
                            <Link style={{ color: "white", textDecoration: "none" }} to="/createPost">
                                Create post
                            </Link>
                        </li>
                        <li style={{ color: "white" }}>
                            <Link style={{ color: "white", textDecoration: "none" }} to="/verUsuarios">
                                ver usuarios
                            </Link>
                        </li>
                    </ul>
                </div>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, flexDirection: "row-reverse", paddingRight: "5%" }}>
                    <button className="btn btn-outline-info" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", height: "100vh", width: "100%" }}>
                <div className="table-container">
                    <table className="table table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.idUser}>
                                    <td>{user.idUser}</td>
                                    <td>{user.nombre}</td>
                                    <td>{user.apellido}</td>
                                    <td>{user.correo}</td>
                                    <td>
                                        <button className="btn btn-outline-danger" onClick={() => deleteUser(user.idUser)} style={{ marginRight: "5%" }}>
                                            Eliminar
                                        </button>
                                        <button className="btn btn-outline-warning" onClick={() => viewUser(user)}>Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {selectedUser && (
                        <Modal show={true} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Detalles del Usuario</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p><strong>ID:</strong> {selectedUser.idUser}</p>
                                <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
                                <p><strong>Apellido:</strong> {selectedUser.apellido}</p>
                                <p><strong>Correo:</strong> {selectedUser.correo}</p>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cerrar
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </div>
            </div>
        </Fragment>
    );
}

export default VerUsuarios;
