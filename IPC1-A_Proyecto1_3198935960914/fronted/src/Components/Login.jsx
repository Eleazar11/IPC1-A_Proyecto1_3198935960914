import React, { useState } from 'react';
import './Styles/Login.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Login() {
    // Creación de los estados de la pantalla
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    // Creación de la cookie que se usará
    const [cookies, setCookie] = useCookies(['student']);
    // Creación del encargado de navegar entre las distintas rutas que tiene nuestro Router
    const navigate = useNavigate();

    // Este método se encarga de comunicarse con nuestro backend para validar si las credenciales son correctas.
    const handleSubmit = (event) => {
        // Evita la recarga de nuestro sitio web
        event.preventDefault();
        const data = {
            correo: correo,
            password: password
        }
        // Este método se encarga de comunicarse con el backend con un endpoint específico, en este caso /login
        fetch(`http://localhost:5000/login`, {
            // Se especifica el tipo de método
            method: "POST", 
            // Se parsea a json el cuerpo que se mandará
            body: JSON.stringify(data),
            // Se agregan los encabezados
            headers: {
                "Content-Type": "application/json",
            },
        })
            // Se obtiene la respuesta y se pasa a json
            .then((response) => response.json())
            // Una vez se tiene la respuesta en json se realizará lo siguiente
            .then((res) => {
                // Imprimimos en consola la respuesta
                console.log(res)
                // Validamos si las credenciales son correctas
                if (res.success) {
                    // De la respuesta que mandó el backend guardamos únicamente el valor del atributo user
                    const dataUser = res.user;
                    // Mostramos el nombre y apellido del usuario
                    Swal.fire({
                        title: 'Login!',
                        text: `Welcome: ${dataUser.nombre} ${dataUser.apellido}`,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    });
                    // Guardamos en las cookies lo que mandó el backend
                    setCookie('student', dataUser);
                    console.log(dataUser.role)
                    // Validamos el rol
                    if (dataUser.role === 0) {
                        // Navegamos a la ruta donde se encuentra la pantalla del admin
                        navigate('/userAdmin')
                    } else if (dataUser.role === 1) {
                        // Navegamos a la ruta donde se encuentra la pantalla del usuario
                        navigate('/userNormal')
                    }
                } else {
                    // Si las credenciales están mal se muestra el siguiente mensaje.
                    Swal.fire({
                        title: 'Error!',
                        text: `Correo and/or password incorrect.`,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
                // Se limpian los estados
                setCorreo("")
                setPassword("")
            })
            .catch((error) => console.error(error));
    };

    return (
        <div className="login-background">
            <div className="container-fluid h-100">
                <div className="row align-items-center h-100">
                    <div className="col-md-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Inicio de Sesión</h2>
                                <form onSubmit={handleSubmit} className='form-signin w-100 m-auto'>
                                    <div className="form-floating" style={{ width: "100%" }}>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="floatingInput"
                                            placeholder="correo@gmail.com"
                                            onChange={(e) => setCorreo(e.target.value)}
                                            value={correo}
                                        />
                                        <label htmlFor="floatingInput">Correo</label>
                                    </div>
                                    <div className="form-floating" style={{ width: "100%" }}>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingPassword"
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                        />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-outline-primary btn-lg">Iniciar Sesión</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
