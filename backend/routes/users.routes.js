const express = require('express');
const router = express.Router();
const supabase = require('../config/db');

// 🔹 Obtener todos los usuarios
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('usuario')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// 🔹 Obtener usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('usuario')
    .select('*')
    .eq('id_usuario', id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;