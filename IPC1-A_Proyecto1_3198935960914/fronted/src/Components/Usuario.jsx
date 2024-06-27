import React, { useState, useEffect, Fragment } from 'react';
import './Styles/Login.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function Usuario() {
    const [posts, setPosts] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['student']);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        fetch(`http://localhost:5000/getPosts`, {
            method: "GET",
        })
        .then((response) => response.json())
        .then((res) => {
            setPosts(res.reverse());
        })
        .catch((error) => console.error(error));
    };

    const handleLogout = () => {
        removeCookie('student');
        navigate('/login');
    };

    const handleDeletePost = (postId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esta acción.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/deletePost/${postId}`, {
                    method: "DELETE",
                })
                .then((response) => response.json())
                .then((res) => {
                    const updatedPosts = posts.filter(post => post.id !== postId);
                    setPosts(updatedPosts);
                    Swal.fire(
                        'Eliminado!',
                        'El post ha sido eliminado correctamente.',
                        'success'
                    );
                })
                .catch((error) => {
                    console.error(error);
                    Swal.fire(
                        'Error',
                        'Hubo un problema al intentar eliminar el post.',
                        'error'
                    );
                });
            }
        });
    };

    return (
        <Fragment>
            <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "100%", top: "0", backgroundColor: "#212529" }}>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: 0, paddingLeft: "5%" }}>
                    <ul style={{ listStyleType: "none", display: "flex", padding: 0, height: "100%", alignItems: "center", margin: "0px" }}>
                        <li style={{ color: "white", marginRight: "15px" }}>
                            <Link style={{ color: "white", textDecoration: "none" }} to="/user">
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
            <div style={{ height: "auto", width: "100%", paddingTop: "5%", paddingRight: "20%", paddingLeft: "20%" }}>
                {posts.length > 0 ? (
                    posts.map((item, index) => (
                        <div className="card mb-3 mb-5" key={index}>
                            <img className="card-img-top" src={item.image} alt="Card image cap" />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">ID: {item.id}</p>
                                <p className="card-text">Director: {item.director}</p>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <button className="btn btn-danger mr-2" onClick={() => handleDeletePost(item.id)}>Eliminar</button>
                                    <Link className="btn btn-primary" to={`/updatePost/${item.id}`}>Actualizar</Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay posts para mostrar.</p>
                )}
            </div>
        </Fragment>
    );
}

export default Usuario;
