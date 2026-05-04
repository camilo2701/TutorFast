const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRoutes = require('./routes/users.routes');
const tutoringAdsRoutes = require('./routes/tutoringAds.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);
app.use('/api/tutoring-ads', tutoringAdsRoutes);

app.get('/', (req, res) => {
  res.send('Backend TutorFast funcionando');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});