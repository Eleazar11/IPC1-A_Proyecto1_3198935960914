import React, { useState, useEffect, Fragment } from 'react';
import './Styles/Login.css';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function RentedMovies() {
    const [rentedMovies, setRentedMovies] = useState([]);
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

    const handleReturnPost = (rentalId) => {
        Swal.fire({
            title: '¿Deseas devolver esta película?',
            text: "Confirma para proceder con la devolución.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, devolver',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5000/devolver`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_alquiler: rentalId,
                        idUsuario: cookies.student.idUser,
                    }),
                })
                    .then((response) => response.json())
                    .then((res) => {
                        Swal.fire('Devuelto!', 'La película ha sido devuelta correctamente.', 'success');
                        fetchRentedMovies();
                    })
                    .catch((error) => {
                        console.error('Error al devolver la película:', error);
                        Swal.fire('Error!', 'Ocurrió un error al devolver la película. Por favor, intenta de nuevo.', 'error');
                    });
            }
        });
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
                                    <button className="btn btn-danger" onClick={() => handleReturnPost(item.id_alquiler)}>
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
        </Fragment>
    );
}

export default RentedMovies;
