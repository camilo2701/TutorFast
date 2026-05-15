const bcrypt = require('bcrypt');
const supabase = require('../config/db');
const DashboardModel = require('../models/dashboard.model');

function formatUser(user) {
  return {
    id: user.id_usuario,
    rut: user.rut,
    name: user.nombre_real,
    username: user.nombre_de_usuario,
    email: user.correo_electronico,
    role: user.rol,
    subscription: user.suscripcion,
    image: user.pfp || 'assets/icon/userpfp.jpg'
  };
}

async function uploadAvatar(file) {
  if (!file) return null;

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Solo se permiten imágenes JPG, JPEG o PNG');
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error('La imagen debe pesar máximo 2MB');
  }

  const ext = file.originalname.split('.').pop();
  const filePath = `profiles/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

async function getMe(req, res) {
  const { data, error } = await DashboardModel.getUserById(req.user.id_usuario);

  if (error || !data) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json(formatUser(data));
}

async function updateMe(req, res) {
  try {
    const updateData = {};

    if (req.body.name) updateData.nombre_real = req.body.name;
    if (req.body.email) updateData.correo_electronico = req.body.email;

    if (req.body.password) {
      updateData.contrasena = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      updateData.pfp = await uploadAvatar(req.file);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No hay cambios para guardar' });
    }

    const { data, error } = await DashboardModel.updateUser(req.user.id_usuario, updateData);

    if (error) return res.status(500).json({ error: error.message });

    res.json({
      message: 'Perfil actualizado',
      user: formatUser(data)
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getReviews(req, res) {
  const user = req.user;

  let result;

  if (user.rol === 2) {
    result = await DashboardModel.getAllReviews();
  } else if (user.rol === 0) {
    result = await DashboardModel.getReviewsByUser(user.id_usuario);
  } else {
    return res.json([]);
  }

  if (result.error) {
    return res.status(500).json({ error: result.error.message });
  }

  const reviews = result.data.map(r => ({
    id: r.id_review,
    userId: r.id_usuario,
    rating: Number(r.calificacion),
    comment: r.contenido_review || '',
    tutorTitle: r.anuncio_tutoria?.titulo || 'Sin título'
  }));

  res.json(reviews);
}

async function deleteReview(req, res) {
  const idReview = Number(req.params.id);

  const { data: review, error: reviewError } = await supabase
    .from('review')
    .select('id_review, id_usuario')
    .eq('id_review', idReview)
    .maybeSingle();

  if (reviewError || !review) {
    return res.status(404).json({ error: 'Review no encontrada' });
  }

  if (req.user.rol !== 2 && review.id_usuario !== req.user.id_usuario) {
    return res.status(403).json({ error: 'No puedes eliminar esta review' });
  }

  const { error } = await DashboardModel.deleteReview(idReview);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Review eliminada' });
}

async function getBookings(req, res) {
  const user = req.user;
  let bookings = [];

  if (user.rol === 0) {
    const { data, error } = await DashboardModel.getBookingsByStudent(user.id_usuario);
    if (error) return res.status(500).json({ error: error.message });

    bookings = data.map(t => ({
      id: t.id_tutoria,
      adId: t.id_anuncio,
      tutor: t.anuncio_tutoria?.usuario?.nombre_real || 'Tutor',
      title: t.anuncio_tutoria?.titulo || 'Sin título',
      amount: `$${t.pago_total}`,
      payment: t.metodo_pago,
      date: t.fecha || ''
    }));
  }

  if (user.rol === 1) {
    const { data: ads, error: adsError } = await DashboardModel.getTutorAds(user.id_usuario);
    if (adsError) return res.status(500).json({ error: adsError.message });

    const adIds = ads.map(a => a.id_anuncio);

    if (adIds.length === 0) return res.json([]);

    const { data, error } = await DashboardModel.getBookingsByTutorAdIds(adIds);
    if (error) return res.status(500).json({ error: error.message });

    bookings = data.map(t => ({
      id: t.id_tutoria,
      adId: t.id_anuncio,
      user: t.usuario?.nombre_real || 'Usuario',
      amount: `$${t.pago_total}`,
      date: t.fecha || ''
    }));
  }

  if (user.rol === 2) {
    const { data, error } = await DashboardModel.getAllBookings();
    if (error) return res.status(500).json({ error: error.message });

    bookings = data.map(t => ({
      id: t.id_tutoria,
      adId: t.id_anuncio,
      user: t.usuario?.nombre_real || 'Usuario',
      tutor: t.anuncio_tutoria?.usuario?.nombre_real || 'Tutor',
      title: t.anuncio_tutoria?.titulo || 'Sin título',
      amount: `$${t.pago_total}`,
      payment: t.metodo_pago,
      date: t.fecha || ''
    }));
  }

  res.json(bookings);
}

async function getAds(req, res) {
  const user = req.user;
  let result;

  if (user.rol === 1) {
    result = await DashboardModel.getTutorAds(user.id_usuario);
  } else if (user.rol === 2) {
    result = await DashboardModel.getAllAds();
  } else {
    return res.json([]);
  }

  if (result.error) {
    return res.status(500).json({ error: result.error.message });
  }

  const ads = result.data.map(a => ({
    id: a.id_anuncio,
    title: a.titulo,
    tutor: a.usuario?.nombre_real || ''
  }));

  res.json(ads);
}

async function getUsers(req, res) {
  if (req.user.rol !== 2) {
    return res.status(403).json({ error: 'Solo admin puede ver usuarios' });
  }

  const { data, error } = await DashboardModel.getAllUsers();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data.map(formatUser));
}

async function updateUser(req, res) {
  if (req.user.rol !== 2) {
    return res.status(403).json({ error: 'Solo admin puede editar usuarios' });
  }

  const idUsuario = Number(req.params.id);

  const updateData = {};

  if (req.body.rut !== undefined) updateData.rut = req.body.rut;
  if (req.body.name !== undefined) updateData.nombre_real = req.body.name;
  if (req.body.username !== undefined) updateData.nombre_de_usuario = req.body.username;
  if (req.body.email !== undefined) updateData.correo_electronico = req.body.email;
  if (req.body.subscription !== undefined) updateData.suscripcion = req.body.subscription;

  const { data, error } = await DashboardModel.updateUser(idUsuario, updateData);

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    message: 'Usuario actualizado',
    user: formatUser(data)
  });
}

async function deleteUser(req, res) {
  if (req.user.rol !== 2) {
    return res.status(403).json({ error: 'Solo admin puede eliminar usuarios' });
  }

  const idUsuario = Number(req.params.id);

  if (idUsuario === req.user.id_usuario) {
    return res.status(400).json({ error: 'No puedes eliminar tu propio usuario' });
  }

  const { error } = await DashboardModel.deleteUser(idUsuario);

  if (error) {
    return res.status(500).json({
      error: 'No se pudo eliminar el usuario. Puede tener tutorías, anuncios o reviews asociadas.'
    });
  }

  res.json({ message: 'Usuario eliminado' });
}

async function deleteUserImage(req, res) {
  if (req.user.rol !== 2) {
    return res.status(403).json({ error: 'Solo admin puede eliminar fotos' });
  }

  const idUsuario = Number(req.params.id);

  const { data, error } = await DashboardModel.deleteUserImage(idUsuario);

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    message: 'Foto eliminada',
    user: formatUser(data)
  });
}

module.exports = {
  getMe,
  updateMe,
  getReviews,
  deleteReview,
  getBookings,
  getAds,
  getUsers,
  updateUser,
  deleteUser,
  deleteUserImage
};