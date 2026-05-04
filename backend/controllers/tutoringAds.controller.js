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

async function getTutoringAdById(req, res) {
  const idAnuncio = Number(req.params.id);

  if (!idAnuncio) {
    return res.status(400).json({ error: 'ID de anuncio inválido' });
  }

  const { data: anuncio, error: anuncioError } =
    await TutoringAdsModel.getTutoringAdById(idAnuncio);

  if (anuncioError) {
    return res.status(500).json({ error: anuncioError.message });
  }

  if (!anuncio) {
    return res.status(404).json({ error: 'Anuncio no encontrado' });
  }

  const { data: reviewsData, error: reviewsError } =
    await TutoringAdsModel.getReviewsByAdId(idAnuncio);

  if (reviewsError) {
    return res.status(500).json({ error: reviewsError.message });
  }

  const reviews = reviewsData.map((review) => ({
    student: review.usuario?.nombre_real || 'Alumno',
    rating: Number(review.calificacion),
    comment: review.contenido_review || ''
  }));

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  res.json({
    id: anuncio.id_anuncio,
    title: anuncio.titulo,
    description: anuncio.descripcion,
    subject: anuncio.asignatura,
    price: anuncio.precio_por_hora,
    active: anuncio.activo,
    boosted: anuncio.boosted,
    tutor: {
      id: anuncio.usuario.id_usuario,
      name: anuncio.usuario.nombre_real,
      image: anuncio.usuario.pfp
    },
    rating: averageRating,
    reviewCount: reviews.length,
    reviews
  });
}

async function createTutoria(req, res) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  if (user.rol !== 0) {
    return res.status(403).json({ error: 'Solo estudiantes pueden contratar tutorías' });
  }

  const { id_anuncio, metodo_pago, pago_total, fecha } = req.body;

  if (!id_anuncio || !metodo_pago || !pago_total || !fecha) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const tutoriaData = {
    verificacion_pago: 1,
    metodo_pago,
    pago_total,
    id_usuario: user.id_usuario,
    id_anuncio,
    fecha
  };

  const { data, error } = await TutoringAdsModel.createTutoria(tutoriaData);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: 'Tutoría confirmada correctamente',
    tutoria: data
  });
}

module.exports = {
  createTutoringAd,
  getTutoringAdById,
  createTutoria
};