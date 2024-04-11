const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, Model, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '10mb' }));

// Configuración de la conexión a la base de datos usando Sequelize
const sequelize = new Sequelize('u196388150_SRT', 'u196388150_SRT', 'o5er$1Gw%cBm345', {
  host: '154.56.47.52',
  dialect: 'mysql'
});

// Definición del modelo Usuario
class Usuario extends Model {}
Usuario.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  App: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Apm: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Correo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Telefono: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { 
  sequelize, 
  modelName: 'Usuario', 
  tableName: 'usuario', 
  timestamps: false // Evita que Sequelize agregue automáticamente las columnas createdAt y updatedAt
});


// Definir rutas

// Registro de usuario
app.post('/signup', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    return res.json(usuario);
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login de usuario
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { Correo: email, Contraseña: password } });
    if (!usuario) {
      return res.status(400).send('Usuario no existe');
    }
    return res.status(200).json({
      id: usuario.id_usuario,
      Nombre: usuario.Nombre,
      App: usuario.App
    });
  } catch (err) {
    console.error('Error al realizar login:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todos los registros de usuarios
app.get('/registros', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    return res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener registros de usuarios:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un registro de usuario por ID
app.delete('/registros/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await Usuario.destroy({ where: { id_usuario: id } });
    if (resultado === 0) {
      return res.status(404).json({ error: 'No se encontró ningún registro para eliminar' });
    }
    return res.status(200).json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar registro de usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un registro de usuario por ID
app.put('/registros/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Usuario.update(req.body, { where: { id_usuario: id } });
    return res.json({ message: 'Datos actualizados correctamente' });
  } catch (err) {
    console.error('Error al actualizar registro de usuario:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Sincronizar modelo con la base de datos y luego iniciar el servidor
sequelize.sync().then(() => {
  app.listen(8080, () => {
    console.log('Servidor iniciado en http://localhost:8080');
  });
});
