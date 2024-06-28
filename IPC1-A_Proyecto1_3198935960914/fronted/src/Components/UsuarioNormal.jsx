import React, { useState, useEffect, Fragment } from 'react';
import './Styles/Login.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Modal, Button } from 'react-bootstrap'; // Importa Modal y Button de react-bootstrap

function UsuarioNormal() {
    const [posts, setPosts] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['student']);
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState(null); // Estado para el post seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        fetch('http://localhost:5000/getPosts', {
            method: 'GET',
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

    const handleRentPost = (postId) => {
        Swal.fire({
            title: '¿Deseas alquilar esta película?',
            text: 'Confirma para proceder con el alquiler.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, alquilar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Realizar la solicitud POST al backend para alquilar la película
                fetch('http://localhost:5000/alquilar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idPost: postId,
                        idUsuario: cookies.student.idUser, // Asegúrate de tener el ID del usuario desde las cookies o de donde esté almacenado
                    }),
                })
                .then((response) => response.json())
                .then((res) => {
                    Swal.fire('Alquilado!', 'La película ha sido alquilada correctamente.', 'success');
                })
                .catch((error) => {
                    console.error('Error al alquilar la película:', error);
                    Swal.fire('Error!', 'Ocurrió un error al alquilar la película. Por favor, intenta de nuevo.', 'error');
                });
            }
        });
    };

    const handleViewMore = (post) => {
        setSelectedPost(post); // Guarda el post seleccionado en el estado
        setShowModal(true); // Muestra el modal
    };

    const handleClose = () => {
        setShowModal(false); // Cierra el modal
    };

    return (
        <Fragment>
            <div style={{ display: 'flex', alignItems: 'center', height: '10vh', width: '100%', top: '0', backgroundColor: '#212529' }}>
                <div style={{ display: 'flex', alignItems: 'center', height: '10vh', width: '50%', top: 0, paddingLeft: '5%' }}>
                    <ul style={{ listStyleType: 'none', display: 'flex', padding: 0, height: '100%', alignItems: 'center', margin: '0px' }}>
                        <li style={{ color: 'white', marginRight: '15px' }}>
                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/userNormal">
                                Movies Disponibles
                            </Link>
                        </li>
                        <li style={{ color: 'white', marginRight: '15px' }}>
                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/returnMovie">
                                Devolver Pelicula
                            </Link>
                        </li>
                        <li style={{ color: 'white' }}>
                            <Link style={{ color: 'white', textDecoration: 'none' }} to="/rentedMovies">
                                Peliculas Alquiladas
                            </Link>
                        </li>
                    </ul>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', height: '10vh', width: '50%', top: 0, flexDirection: 'row-reverse', paddingRight: '5%' }}>
                    <button className="btn btn-outline-info" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div style={{ height: 'auto', width: '100%', paddingTop: '5%', paddingRight: '20%', paddingLeft: '20%' }}>
                {posts.length > 0 ? (
                    posts.map((item, index) => (
                        <div className="card mb-3 mb-5" key={index}>
                            <img className="card-img-top" src={item.image} alt="Card image cap" style={{ maxWidth: '50%', height: 'auto', display: 'block', margin: 'auto' }} />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">ID: {item.id}</p>
                                <p className="card-text">Director: {item.director}</p>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-success mr-2" onClick={() => handleRentPost(item.id)}>Alquilar</button>
                                    <button className="btn btn-primary" onClick={() => handleViewMore(item)}>Ver más info.</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay posts para mostrar.</p>
                )}
            </div>

            {/* Modal para mostrar los detalles del post seleccionado */}
            {selectedPost && (
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalles de la Película</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>Título:</strong> {selectedPost.title}</p>
                        <p><strong>Sinopsis:</strong> {selectedPost.sinopsis}</p>
                        <p><strong>Precio de Alquiler:</strong> {selectedPost.rentalPrice}</p>
                        <p><strong>Director:</strong> {selectedPost.director}</p>
                        <p><strong>Año de Estreno:</strong> {selectedPost.releaseYear}</p>
                        <p><strong>Duración:</strong> {selectedPost.duration} minutos</p>
                        <p><strong>Género:</strong> {selectedPost.genre}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment>
    );
}

export default UsuarioNormal;
