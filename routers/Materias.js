const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Lista todas las materias
router.get('/', (req, res) => {
    db.all('SELECT * FROM materias', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: rows.length, data: rows });
    });
});

// GET - Busca una materia por ID
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM materias WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Materia no encontrada' });
        res.json({ success: true, data: row });
    });
});

// POST - Crea una nueva materia
router.post('/', (req, res) => {
    const { nombre, descripcion, profesorId } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !descripcion || !profesorId) {
        return res.status(400).json({ success: false, message: 'nombre, descripcion y profesorId son obligatorios' });
    }

    // Insertar la nueva materia en la base de datos
    db.run('INSERT INTO materias (nombre, descripcion, profesorId) VALUES (?, ?, ?)',
        [nombre, descripcion, profesorId],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.status(201).json({ success: true, data: { id: this.lastID, nombre, descripcion, profesorId } });
        }
    );
});

// PUT - Actualiza los datos de una materia
router.put('/:id', (req, res) => {
    const { nombre, descripcion, profesorId } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !descripcion || !profesorId) {
        return res.status(400).json({ success: false, message: 'nombre, descripcion y profesorId son obligatorios' });
    }

    // Actualizar la materia en la base de datos
    db.run('UPDATE materias SET nombre = ?, descripcion = ?, profesorId = ? WHERE id = ?',
        [nombre, descripcion, profesorId, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            // Si no encontró ningún registro con ese ID
            if (this.changes === 0) return res.status(404).json({ success: false, message: 'Materia no encontrada' });
            res.json({ success: true, data: { id: req.params.id, nombre, descripcion, profesorId } });
        }
    );
});

// DELETE - Elimina una materia
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM materias WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        // Si no encontró ningún registro con ese ID
        if (this.changes === 0) return res.status(404).json({ success: false, message: 'Materia no encontrada' });
        res.json({ success: true, message: 'Materia eliminada' });
    });
});

module.exports = router;