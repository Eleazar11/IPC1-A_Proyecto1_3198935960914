import React, { useState, useEffect, Fragment } from 'react';
import './Styles/Login.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';

function RentedMovies() {
    const [rentedMovies, setRentedMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [cookies, , removeCookie] = useCookies(['student']);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRentedMovies();
    }, []);

    const fetchRentedMovies = () => {
        fetch('http://localhost:5000/getRentedMovies', {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((res) => {
                setRentedMovies(res);
            })
            .catch((error) => console.error(error));
    };

    const handleLogout = () => {
        removeCookie('student');
        navigate('/login');
    };

    const handleReturnClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleReturnMovie = () => {
        const returnDateTime = new Date(`${returnDate}T${returnTime}:00`);
        const rentedDateTime = new Date(selectedMovie.rentalDate);

        const timeDifference = returnDateTime - rentedDateTime;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        const daysDifference = Math.ceil(hoursDifference / 24);

        let payment = selectedMovie.rentalPrice;
        if (daysDifference > 2) {
            payment += (daysDifference - 2) * 5;
        }

        Swal.fire({
            title: 'Total a pagar',
            text: `El total a pagar es $${payment}.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Pagar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/devolver`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_alquiler: selectedMovie.id_alquiler,
                        idUsuario: cookies.student.idUser,
                        returnDate: returnDateTime
                    }),
                })
                    .then((response) => response.json())
                    .then((res) => {
                        Swal.fire('Devuelto!', 'La película ha sido devuelta correctamente.', 'success');
                        setSelectedMovie(null);
                        setReturnDate('');
                        setReturnTime('');
                        fetchRentedMovies();
                    })
                    .catch((error) => {
                        console.error('Error al devolver la película:', error);
                        Swal.fire('Error!', 'Ocurrió un error al devolver la película. Por favor, intenta de nuevo.', 'error');
                    });
            }
        });
    };

    const handleClose = () => {
        setSelectedMovie(null);
        setReturnDate('');
        setReturnTime('');
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
                {rentedMovies.length > 0 ? (
                    rentedMovies.map((item, index) => (
                        <div className="card mb-3 mb-5" key={index}>
                            <img className="card-img-top" src={item.image} alt="Card image cap" style={{ maxWidth: '50%', height: 'auto', display: 'block', margin: 'auto' }} />
                            <div className="card-body">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text">ID: {item.id}</p>
                                <p className="card-text">Director: {item.director}</p>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-danger" onClick={() => handleReturnClick(item)}>
                                        Devolver
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay películas alquiladas para mostrar.</p>
                )}
            </div>

            {selectedMovie && (
                <Modal show={true} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Devolver Película</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><strong>ID:</strong> {selectedMovie.id}</p>
                        <p><strong>Título:</strong> {selectedMovie.title}</p>
                        <p><strong>Director:</strong> {selectedMovie.director}</p>
                        <p><strong>Precio de Alquiler:</strong> ${selectedMovie.rentalPrice}</p>
                        <Form>
                            <Form.Group controlId="formReturnDate">
                                <Form.Label>Fecha de Devolución</Form.Label>
                                <Form.Control type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formReturnTime">
                                <Form.Label>Hora de Devolución</Form.Label>
                                <Form.Control type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="primary" onClick={handleReturnMovie}>
                            Devolver
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment>
    );
}

export default RentedMovies;
