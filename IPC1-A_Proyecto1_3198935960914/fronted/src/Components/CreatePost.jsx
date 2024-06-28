import React, { useState, useEffect, Fragment } from 'react';
import './Styles/Login.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [rentalPrice, setRentalPrice] = useState(0);
    const [director, setDirector] = useState("");
    const [releaseYear, setReleaseYear] = useState(0);
    const [duration, setDuration] = useState(0);
    const [genre, setGenre] = useState("");
    const [base64Image, setBase64Image] = useState('');
    const [selectedImage, setSelectedImage] = useState('https://cdn.pixabay.com/photo/2022/06/29/08/29/loading-7291248_1280.png');
    const [lastId, setLastId] = useState(0);
    
    const [cookies, setCookie, removeCookie] = useCookies(['student']);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the last used ID from the backend
        fetch(`http://localhost:5000/getLastPostId`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((res) => {
                setLastId(res.lastId); // Assuming the response contains the last ID used
            })
            .catch((error) => console.error(error));
    }, []);

    const handleLogout = () => {
        removeCookie('student');
        navigate('/login');
    };

    const handleImageChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(URL.createObjectURL(file));
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePost = () => {
        const userName = cookies.student;
        const newPostId = `m${lastId + 1}`;
        const data = {
            id: newPostId,
            title: title,
            synopsis: synopsis,
            rentalPrice: rentalPrice,
            director: director,
            releaseYear: releaseYear,
            duration: duration,
            genre: genre,
            image: base64Image,
            name: `${userName.nombre} ${userName.apellido}`
        };

        fetch(`http://localhost:5000/createPost`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((res) => {
                console.log(res);
                alert(res.response);
                setLastId(lastId + 1); // Update lastId for the next post
                clearFields();
            })
            .catch((error) => console.error(error));
    };

    const clearFields = () => {
        setTitle("");
        setSynopsis("");
        setRentalPrice(0);
        setDirector("");
        setReleaseYear(0);
        setDuration(0);
        setGenre("");
        setSelectedImage('https://cdn.pixabay.com/photo/2022/06/29/08/29/loading-7291248_1280.png');
    };

    return (
        <Fragment>
            <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "100%", top: "0", backgroundColor: "#212529" }}>
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: "0", paddingLeft: "5%" }}>
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
                <div style={{ display: "flex", alignItems: "center", height: "10vh", width: "50%", top: "0", flexDirection: "row-reverse", paddingRight: "5%" }}>
                    <button className="btn btn-outline-info" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", height: "90vh", width: "100%", top: "10", paddingBottom: "5%", paddingTop: "5%" }}>
                <div className="container-fluid h-100" style={{ marginRight: "20%", marginLeft: "20%", borderRadius: "25px", backgroundColor: "#172B6B", display: "flex", padding: "5%", color: "white", flexDirection: "column", overflowY:"auto" }}>
                    <h1>Titulo:</h1>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <h1>Sinopsis:</h1>
                    <textarea className="form-control" rows="5" style={{ resize: "none", marginTop: "3%" }} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
                    <h1>Precio Renta:</h1>
                    <input type="number" className="form-control" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} />
                    <h1>Director:</h1>
                    <input type="text" className="form-control" value={director} onChange={(e) => setDirector(e.target.value)} />
                    <h1>Ano estreno:</h1>
                    <input type="number" className="form-control" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} />
                    <h1>Duracion (minutos):</h1>
                    <input type="number" className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    <h1>Genero:</h1>
                    <input type="text" className="form-control" value={genre} onChange={(e) => setGenre(e.target.value)} />
                    <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: "5%", flexDirection: "column", marginBottom: "10%" }}>
                        <label htmlFor="file-upload" className="btn btn-outline-warning" style={{ fontSize: "19px", width: "100%", height: "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16" style={{ marginRight: "1%" }}>
                                <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
                            </svg>
                            {" Elije la portada de la película"}
                        </label>
                        <input onChange={handleImageChange} id="file-upload" type="file" accept="image/*" style={{ display: "none" }} />
                        {selectedImage && <img src={selectedImage} alt="Selected" style={{ objectFit: "cover", width: "22rem", maxHeight: "12rem", marginTop: "1rem" }} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", marginTop: "5%" }}>
                        <button type="button" className="btn btn-outline-light" onClick={handlePost}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                            </svg>
                            {" Post"}
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default CreatePost;
