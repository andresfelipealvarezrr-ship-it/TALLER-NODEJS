const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Lista todos los profesores
router.get('/', (req, res) => {
    db.all('SELECT * FROM profesores', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, total: rows.length, data: rows });
    });
});

// GET - Busca un profesor por ID
router.get('/:id', (req, res) => {
    db.get('SELECT * FROM profesores WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!row) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
        res.json({ success: true, data: row });
    });
});

// POST - Crea un nuevo profesor
router.post('/', (req, res) => {
    const { nombre, email, especialidad } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !email || !especialidad) {
        return res.status(400).json({ success: false, message: 'nombre, email y especialidad son obligatorios' });
    }

    // Validación: el email no puede repetirse
    db.get('SELECT id FROM profesores WHERE email = ?', [email], (err, row) => {
        if (row) return res.status(400).json({ success: false, message: 'El email ya está registrado' });

        // Insertar el nuevo profesor en la base de datos
        db.run('INSERT INTO profesores (nombre, email, especialidad) VALUES (?, ?, ?)',
            [nombre, email, especialidad],
            function (err) {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.status(201).json({ success: true, data: { id: this.lastID, nombre, email, especialidad } });
            }
        );
    });
});

// PUT - Actualiza los datos de un profesor
router.put('/:id', (req, res) => {
    const { nombre, email, especialidad } = req.body;

    // Validación: campos obligatorios
    if (!nombre || !email || !especialidad) {
        return res.status(400).json({ success: false, message: 'nombre, email y especialidad son obligatorios' });
    }

    // Actualizar el profesor en la base de datos
    db.run('UPDATE profesores SET nombre = ?, email = ?, especialidad = ? WHERE id = ?',
        [nombre, email, especialidad, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            // Si no encontró ningún registro con ese ID
            if (this.changes === 0) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
            res.json({ success: true, data: { id: req.params.id, nombre, email, especialidad } });
        }
    );
});

// DELETE - Elimina un profesor
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM profesores WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        // Si no encontró ningún registro con ese ID
        if (this.changes === 0) return res.status(404).json({ success: false, message: 'Profesor no encontrado' });
        res.json({ success: true, message: 'Profesor eliminado' });
    });
});

module.exports = router;
