const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRoutes = require('./routes/users.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('Backend TutorFast funcionando');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});