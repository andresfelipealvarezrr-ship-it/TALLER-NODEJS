const express = require('express');
const app = express();

require('./db'); // ← AGREGA ESTA LÍNEA

app.use(express.json());

const Estudiantes = require('./routers/Estudiantes');
const Profesores = require('./routers/Profesores');
const materias = require('./routers/Materias');
const notas = require('./routers/Notas');

app.use('/estudiantes', Estudiantes);
app.use('/profesores', Profesores);
app.use('/materias', materias);
app.use('/notas', notas);

app.listen(3000, () => {
    console.log('API corriendo en http://localhost:3000');
});
