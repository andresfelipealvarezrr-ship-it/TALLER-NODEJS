const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Lista todos los estudiantes
router.get('/', (req, res) => {
    db.all('SELECT * FROM estudiantes', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: rows.length, data: rows });
    });
});

// GET - Busca un estudiante por ID
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM estudiantes WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        res.json({ success: true, data: row });
    });
});

// POST - Crea un nuevo estudiante
router.post('/', (req, res) => {
    const { nombre, email, grado } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !email || !grado) {
        return res.status(400).json({ success: false, message: 'nombre, email y grado son obligatorios' });
    }

    // Validación: el email no puede repetirse
    db.get('SELECT id FROM estudiantes WHERE email = ?', [email], (err, row) => {
        if (row) return res.status(400).json({ success: false, message: 'El email ya está registrado' });

        // Insertar el nuevo estudiante en la base de datos
        db.run('INSERT INTO estudiantes (nombre, email, grado) VALUES (?, ?, ?)',
            [nombre, email, grado],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(201).json({ success: true, data: { id: this.lastID, nombre, email, grado } });
            }
        );
    });
});

// PUT - Actualiza los datos de un estudiante
router.put('/:id', (req, res) => {
    const { nombre, email, grado } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !email || !grado) {
        return res.status(400).json({ success: false, message: 'nombre, email y grado son obligatorios' });
    }

    // Actualizar el estudiante en la base de datos
    db.run('UPDATE estudiantes SET nombre = ?, email = ?, grado = ? WHERE id = ?',
        [nombre, email, grado, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            // Si no encontró ningún registro con ese ID
            if (this.changes === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
            res.json({ success: true, data: { id: req.params.id, nombre, email, grado } });
        }
    );
});

// DELETE - Elimina un estudiante
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM estudiantes WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        // Si no encontró ningún registro con ese ID
        if (this.changes === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
        res.json({ success: true, message: 'Estudiante eliminado' });
    });
});

module.exports = router;
