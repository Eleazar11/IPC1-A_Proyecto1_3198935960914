// UpdatePost.js
import React, { useState, useEffect, Fragment } from 'react';
import './Styles/Login.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const UpdatePost = () => {
    const { postId } = useParams(); // Obtener el postId de los parámetros de la ruta
    const [post, setPost] = useState(null); // Estado para almacenar los datos del post

    useEffect(() => {
        fetch(`http://localhost:5000/getPost/${postId}`) // Asumiendo que tienes un endpoint para obtener un post específico
            .then(response => response.json())
            .then(data => {
                setPost(data); // Actualizar el estado con los datos del post
            })
            .catch(error => console.error('Error al cargar el post:', error));
    }, [postId]);

    if (!post) {
        return <div>Cargando...</div>; // Puedes mostrar un mensaje de carga mientras se obtienen los datos
    }

    return (
        <div>
            <h1>Actualizar Post</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input type="text" className="form-control" id="title" value={post.title}  />
                </div>
                <div className="form-group">
                    <label htmlFor="director">Director</label>
                    <input type="text" className="form-control" id="director" value={post.director} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea className="form-control" id="description" value={post.description} ></textarea>
                </div>
                {/* Agregar más campos según necesites */}
                <button type="submit" className="btn btn-primary">Actualizar Post</button>
            </form>
        </div>
    );
}

export default UpdatePost;
