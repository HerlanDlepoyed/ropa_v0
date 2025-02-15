const express = require('express')
const db = require('./db')
const app = express()
const port = 6000
//cors
const cors = require('cors');
app.use(cors());
// Test database connection use /ping
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Permite acceder a las imágenes subidas
app.use('/usuarios', require('./routes/usuarios.routes'));
app.use('/productos', require('./routes/productos.routes'));
app.use('/test',require('./routes/test.routes'))
app.use('/categoria', require('./routes/categoria.routes'))
//hacemos una ruta ping a la base de datos 
app.get('/ping', async (req, res) => {
    try {
      // Intentamos hacer un ping a la base de datos
      await db.query('SELECT 1');
      res.status(200).json({ message: 'Database is up and running' });
    } catch (err) {
      console.error('Error connecting to the database:', err);
      res.status(500).json({ message: 'Error connecting to the database', error: err.message });
    }
  });
  

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});