const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());

// Middleware para habilitar CORS
app.use(cors());

// Función para agregar un delay aleatorio de 1 a 3 segundos
const addRandomDelay = (req, res, next) => {
  const delay = Math.floor(Math.random() * 3000) + 1000;
  setTimeout(next, delay);
};

// Lista de hospitales hardcodeados
let hospitales = [
  { id: 1, nombre: 'Hospital Central', direccion: 'Av. Principal 123' },
  { id: 2, nombre: 'Hospital Norte', direccion: 'Calle Secundaria 456' },
  { id: 3, nombre: 'Hospital Sur', direccion: 'Boulevard Principal 789' }
];

// Ruta GET para obtener la lista de hospitales con delay
app.get('/hospitales', addRandomDelay, (req, res) => {
  res.json(hospitales);
});

// Ruta GET para obtener un hospital por ID con delay
app.get('/hospitales/:id', addRandomDelay, (req, res) => {
  const { id } = req.params;
  const hospital = hospitales.find(h => h.id == id);

  if (hospital) {
    res.json(hospital);
  } else {
    res.status(404).json({ message: 'Hospital no encontrado' });
  }
});

// Ruta POST para agregar un nuevo hospital con delay
app.post('/hospitales', addRandomDelay, (req, res) => {
  const newHospital = req.body;
  newHospital.id = hospitales.length ? hospitales[hospitales.length - 1].id + 1 : 1;
  hospitales.push(newHospital);
  res.status(201).json(newHospital);
});

// Ruta PUT para actualizar un hospital existente con delay
app.put('/hospitales/:id', addRandomDelay, (req, res) => {
  const { id } = req.params;
  const updatedHospital = req.body;
  let hospitalIndex = hospitales.findIndex(hospital => hospital.id == id);

  if (hospitalIndex !== -1) {
    hospitales[hospitalIndex] = { ...hospitales[hospitalIndex], ...updatedHospital };
    res.json(hospitales[hospitalIndex]);
  } else {
    res.status(404).json({ message: 'Hospital no encontrado' });
  }
});

// Ruta DELETE para eliminar un hospital con delay
app.delete('/hospitales/:id', addRandomDelay, (req, res) => {
  const { id } = req.params;
  const hospitalIndex = hospitales.findIndex(hospital => hospital.id == id);

  if (hospitalIndex !== -1) {
    const deletedHospital = hospitales.splice(hospitalIndex, 1);
    res.json(deletedHospital);
  } else {
    res.status(404).json({ message: 'Hospital no encontrado' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
