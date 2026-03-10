const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión a la base de datos

// GET - Lista todas las notas
router.get('/', (req, res) => {
    // Trae todos los registros de la tabla notas
    db.all('SELECT * FROM notas', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: rows.length, data: rows });
    });
});

// GET - Busca una nota por ID
router.get('/:id', (req, res) => {
    // Busca un solo registro que coincida con el ID
    db.get('SELECT * FROM notas WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        // Si no existe, responde con error 404
        if (!row) return res.status(404).json({ success: false, message: 'Nota no encontrada' });
        res.json({ success: true, data: row });
    });
});

// POST - Crea una nueva nota
router.post('/', (req, res) => {
    const { valor, estudianteId, materiaId } = req.body;

    // Validación: todos los campos son obligatorios
    if (!valor || !estudianteId || !materiaId) {
        return res.status(400).json({ success: false, message: 'valor, estudianteId y materiaId son obligatorios' });
    }

    // Validación: el valor debe ser un número entre 0 y 5
    if (isNaN(valor) || valor < 0 || valor > 5) {
        return res.status(400).json({ success: false, message: 'valor debe ser un número entre 0 y 5' });
    }

    // Insertar la nueva nota en la base de datos
    db.run('INSERT INTO notas (valor, estudianteId, materiaId) VALUES (?, ?, ?)',
        [valor, estudianteId, materiaId],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            // Responde con la nota creada y su nuevo ID
            res.status(201).json({ success: true, data: { id: this.lastID, valor, estudianteId, materiaId } });
        }
    );
});

// PUT - Actualiza una nota existente
router.put('/:id', (req, res) => {
    const { valor, estudianteId, materiaId } = req.body;

    // Validación: todos los campos son obligatorios
    if (!valor || !estudianteId || !materiaId) {
        return res.status(400).json({ success: false, message: 'valor, estudianteId y materiaId son obligatorios' });
    }

    // Validación: el valor debe ser un número entre 0 y 5
    if (isNaN(valor) || valor < 0 || valor > 5) {
        return res.status(400).json({ success: false, message: 'valor debe ser un número entre 0 y 5' });
    }

    // Actualizar la nota en la base de datos
    db.run('UPDATE notas SET valor = ?, estudianteId = ?, materiaId = ? WHERE id = ?',
        [valor, estudianteId, materiaId, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            // Si no encontró ningún registro con ese ID
            if (this.changes === 0) return res.status(404).json({ success: false, message: 'Nota no encontrada' });
            res.json({ success: true, data: { id: req.params.id, valor, estudianteId, materiaId } });
        }
    );
});

// DELETE - Elimina una nota
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM notas WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        // Si no encontró ningún registro con ese ID
        if (this.changes === 0) return res.status(404).json({ success: false, message: 'Nota no encontrada' });
        res.json({ success: true, message: 'Nota eliminada' });
    });
});

module.exports = router;
