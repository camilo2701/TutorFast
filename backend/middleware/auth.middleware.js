const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token no enviado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('usuario')
      .select('id_usuario, rol, suscripcion')
      .eq('id_usuario', decoded.id_usuario)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verifyToken;