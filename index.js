const express = require('express');
const app = express();
const env = require('dotenv').config();
const port = process.env.PORT || 3000;
const pass = process.env.API_PASSWORD;


require('./db'); // ← AGREGA ESTA LÍNEA


const Estudiantes = require('./routers/Estudiantes');
const Profesores = require('./routers/Profesores');
const materias = require('./routers/Materias');
const notas = require('./routers/Notas');
app.use(express.json());


app.use((req, res, next) =>{
    const apiKey = req.headers['password'];
    if (!apiKey) return res.status(401).json({ success: false, message: 'API key requerida' });
    if (apiKey !== process.env.API_PASSWORD) {
        return res.status(403).json({ success: false, message: 'Password incorrecta' });
    }
    next();
});

app.use('/estudiantes', Estudiantes);
app.use('/profesores', Profesores);
app.use('/materias', materias);
app.use('/notas', notas);

app.listen(3000, () => {
    console.log('API corriendo en http://localhost:3000');
});
