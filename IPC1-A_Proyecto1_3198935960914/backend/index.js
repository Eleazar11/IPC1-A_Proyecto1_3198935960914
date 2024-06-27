const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;
const FILENAME = 'Usuarios.json';
const FILENAME1 = 'Posts.json';

app.use(bodyParser.json());
app.use(cors());

let dataStudents = [];
let dataPosts = [];

function readDataFromFile(filename) {
    if (fs.existsSync(filename)) {
        const fileData = fs.readFileSync(filename, 'utf8');
        return fileData.length > 0 ? JSON.parse(fileData) : [];
    } else {
        return [];
    }
}

function updateDataFile(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2)); // Agregamos null, 2 para formatear el JSON con indentación
}

dataStudents = readDataFromFile(FILENAME);
dataPosts = readDataFromFile(FILENAME1);

app.post('/login', (req, res) => {
    const data = req.body;
    const student = dataStudents.find(student => student.correo === data.correo && student.password === data.password);
    if (!student) {
        res.status(404).send({
            success: false,
            user: null
        });
    } else {
        res.json({
            success: true,
            user: student
        });
    }
});

app.get('/getPosts', (req, res) => {
    res.json(dataPosts);
});

app.get("/students", (req, res) => {
    res.json(dataStudents);
});

app.get("/students/:idUser", (req, res) => {
    const idUser = parseInt(req.params.idUser, 10);
    const student = dataStudents.find(student => student.idUser === idUser);
    if (!student) {
        res.status(404).send({ response: 'Usuario no encontrado' });
    } else {
        res.json(student);
    }
});

app.get('/getLastPostId', (req, res) => {
    if (dataPosts.length === 0) {
        res.json({ lastId: 0 });
    } else {
        const lastPost = dataPosts[dataPosts.length - 1];
        const lastId = parseInt(lastPost.id.substring(1));
        res.json({ lastId });
    }
});

app.post("/students", (req, res) => {
    const newStudent = req.body;
    dataStudents.push(newStudent);
    updateDataFile(FILENAME, dataStudents);
    res.status(201).send({ response: "Elemento creado correctamente." });
});

app.post('/createPost', (req, res) => {
    const newPost = req.body;
    const savePost = {
        id: `P${dataPosts.length + 1}`,
        title: newPost.title,
        synopsis: newPost.synopsis,
        rentalPrice: newPost.rentalPrice,
        director: newPost.director,
        releaseYear: newPost.releaseYear,
        duration: newPost.duration,
        genre: newPost.genre,
        image: newPost.image,
        name: newPost.name
    };
    dataPosts.push(savePost);
    updateDataFile(FILENAME1, dataPosts);
    res.status(201).send({ response: 'Publicación guardada correctamente.' });
});


app.put("/students/:idUser", (req, res) => {
    const idUser = parseInt(req.params.idUser, 10);
    const updatedStudent = req.body;
    const index = dataStudents.findIndex(student => student.idUser === idUser);
    if (index === -1) {
        res.status(404).send({ response: 'Usuario no encontrado' });
    } else {
        dataStudents[index].nombre = updatedStudent.nombre;
        dataStudents[index].apellido = updatedStudent.apellido;
        dataStudents[index].genero = updatedStudent.genero;
        dataStudents[index].correo = updatedStudent.correo;
        dataStudents[index].password = updatedStudent.password;
        dataStudents[index].fecha_nacimieto = updatedStudent.fecha_nacimieto;
        dataStudents[index].role = updatedStudent.role;
        updateDataFile(FILENAME, dataStudents);
        res.send({ response: 'Usuario actualizado correctamente' });
    }
});

app.delete('/deletePost/:postId', (req, res) => {
    const postId = req.params.postId;
    const index = dataPosts.findIndex(post => post.id === postId);
    if (index === -1) {
        res.status(404).send({ response: 'Publicación no encontrada' });
    } else {
        dataPosts.splice(index, 1);
        updateDataFile(FILENAME1, dataPosts);
        res.send({ response: 'Publicación eliminada correctamente' });
    }
});

app.delete('/students/:idUser', (req, res) => {
    const idUser = parseInt(req.params.idUser, 10);
    const index = dataStudents.findIndex(student => student.idUser === idUser);
    if (index === -1) {
        res.status(404).send({ mensaje: 'Usuario no encontrado' });
    } else {
        dataStudents.splice(index, 1);
        updateDataFile(FILENAME, dataStudents);
        res.send({ mensaje: 'Usuario eliminado correctamente' });
    }
});

app.get('/getPost/:postId', (req, res) => {
    const postId = req.params.postId;
    const post = dataPosts.find(post => post.id === postId);
    if (!post) {
        res.status(404).send({ response: 'Publicación no encontrada' });
    } else {
        res.json(post);
    }
});


app.put('/updatePost/:postId', (req, res) => {
    const postId = req.params.postId;
    const updatedPost = req.body;

    const index = dataPosts.findIndex(post => post.id === postId);
    if (index === -1) {
        res.status(404).send({ response: 'Publicación no encontrada' });
    } else {
        dataPosts[index].title = updatedPost.title;
        dataPosts[index].synopsis = updatedPost.synopsis;
        dataPosts[index].rentalPrice = updatedPost.rentalPrice;
        dataPosts[index].director = updatedPost.director;
        dataPosts[index].releaseYear = updatedPost.releaseYear;
        dataPosts[index].duration = updatedPost.duration;
        dataPosts[index].genre = updatedPost.genre;
        dataPosts[index].image = updatedPost.image;

        updateDataFile(FILENAME1, dataPosts);
        res.send({ response: 'Publicación actualizada correctamente' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${PORT}`);
});
