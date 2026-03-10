const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./basedatos.db', (err) => {
    if (err) console.error('Error conectando:', err.message);
    else console.log('Base de datos conectada ✅');
});

db.serialize(() => {

    db.run(`pragma foreign_keys = ON`);

    db.run(`CREATE TABLE IF NOT EXISTS materias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        profesorId INTEGER NOT NULL,
        FOREIGN KEY (profesorId) REFERENCES profesores(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        grado TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS notas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        valor REAL NOT NULL,
        estudianteId INTEGER NOT NULL,
        materiaId INTEGER NOT NULL,
        FOREIGN KEY (estudianteId) REFERENCES estudiantes(id),
        FOREIGN KEY (materiaId) REFERENCES materias(id)
    )`);

});

module.exports = db;

