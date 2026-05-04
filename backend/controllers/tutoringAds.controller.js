const TutoringAdsModel = require('../models/tutoringAds.model');

async function createTutoringAd(req, res) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (user.rol !== 1) {
    return res.status(403).json({ error: 'Solo los tutores pueden publicar anuncios' });
  }

  const {
    precio_por_hora,
    titulo,
    descripcion,
    asignatura,
    boosted
  } = req.body;

  if (!precio_por_hora || !titulo || !descripcion || !asignatura) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (boosted === true && user.suscripcion !== true) {
    return res.status(403).json({
      error: 'Necesitas una suscripción activa para potenciar anuncios'
    });
  }

  const adData = {
    precio_por_hora,
    titulo,
    descripcion,
    asignatura,
    boosted: boosted === true,
    activo: 1,
    id_usuario: user.id_usuario
  };

  const { data, error } = await TutoringAdsModel.createTutoringAd(adData);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: 'Anuncio creado correctamente',
    anuncio: data
  });
}

module.exports = {
  createTutoringAd
};