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
    boosted,
    modality
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
    modality,
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
    modality: anuncio.modality,
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

async function getAllTutoringAds(req, res) {
  const { data, error } = await TutoringAdsModel.getAllTutoringAds();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const modalityMap = {
    0: 'Online',
    1: 'Presencial',
    2: 'Presencial y Online'
  };

  const tutorias = data.map((ad) => {
    const reviews = ad.review || [];

    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + Number(r.calificacion), 0) / reviews.length
        : 0;

    return {
      id: ad.id_anuncio,
      name: ad.titulo,
      price: ad.precio_por_hora,
      modalidad: modalityMap[ad.modality] || 'Online',
      calificacion: Number(avg.toFixed(1)),
      descripcion: ad.descripcion,
      premium: ad.boosted === true,
      pfpURL: ad.usuario?.pfp || 'assets/icon/userpfp.jpg'
    };
  });

  res.json(tutorias);
}

async function getFeaturedTutors(req, res) {
  const { data, error } = await TutoringAdsModel.getAllConfirmedTutorias();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const tutorMap = {};

  data.forEach((tutoria) => {
    const tutor = tutoria.anuncio_tutoria?.usuario;

    if (!tutor) return;

    if (!tutorMap[tutor.id_usuario]) {
      tutorMap[tutor.id_usuario] = {
        id: tutor.id_usuario,
        nombre: tutor.nombre_real,
        pfpURL: tutor.pfp || 'assets/icon/userpfp.jpg',
        tutoriaCount: 0
      };
    }

    tutorMap[tutor.id_usuario].tutoriaCount++;
  });

  const featured = Object.values(tutorMap)
    .sort((a, b) => b.tutoriaCount - a.tutoriaCount)
    .slice(0, 3);

  res.json(featured);
}

module.exports = {
  createTutoringAd,
  getTutoringAdById,
  createTutoria,
  getAllTutoringAds,
  getFeaturedTutors
};