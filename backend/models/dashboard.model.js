const supabase = require('../config/db');

async function getUserById(idUsuario) {
  return await supabase
    .from('usuario')
    .select('id_usuario, nombre_real, nombre_de_usuario, correo_electronico, rol, rut, suscripcion, pfp')
    .eq('id_usuario', idUsuario)
    .maybeSingle();
}

async function updateUser(idUsuario, data) {
  return await supabase
    .from('usuario')
    .update(data)
    .eq('id_usuario', idUsuario)
    .select()
    .single();
}

async function deleteUser(idUsuario) {
  return await supabase
    .from('usuario')
    .delete()
    .eq('id_usuario', idUsuario);
}

async function deleteUserImage(idUsuario) {
  return await supabase
    .from('usuario')
    .update({ pfp: null })
    .eq('id_usuario', idUsuario)
    .select()
    .single();
}

async function getAllReviews() {
  return await supabase
    .from('review')
    .select(`
      id_review,
      calificacion,
      contenido_review,
      id_usuario,
      anuncio_tutoria (
        id_anuncio,
        titulo
      )
    `);
}

async function getReviewsByUser(idUsuario) {
  return await supabase
    .from('review')
    .select(`
      id_review,
      calificacion,
      contenido_review,
      id_usuario,
      anuncio_tutoria (
        id_anuncio,
        titulo
      )
    `)
    .eq('id_usuario', idUsuario);
}

async function deleteReview(idReview) {
  return await supabase
    .from('review')
    .delete()
    .eq('id_review', idReview);
}

async function getAllBookings() {
  return await supabase
    .from('tutoria')
    .select(`
      id_tutoria,
      metodo_pago,
      pago_total,
      fecha,
      id_anuncio,
      usuario (
        id_usuario,
        nombre_real
      ),
      anuncio_tutoria (
        id_anuncio,
        titulo,
        usuario (
          id_usuario,
          nombre_real
        )
      )
    `);
}

async function getBookingsByStudent(idUsuario) {
  return await supabase
    .from('tutoria')
    .select(`
      id_tutoria,
      metodo_pago,
      pago_total,
      fecha,
      id_anuncio,
      anuncio_tutoria (
        id_anuncio,
        titulo,
        usuario (
          id_usuario,
          nombre_real
        )
      )
    `)
    .eq('id_usuario', idUsuario);
}

async function getTutorAds(idUsuario) {
  return await supabase
    .from('anuncio_tutoria')
    .select('id_anuncio, titulo, id_usuario')
    .eq('id_usuario', idUsuario);
}

async function getBookingsByTutorAdIds(adIds) {
  return await supabase
    .from('tutoria')
    .select(`
      id_tutoria,
      metodo_pago,
      pago_total,
      fecha,
      id_anuncio,
      usuario (
        id_usuario,
        nombre_real
      )
    `)
    .in('id_anuncio', adIds);
}

async function getAllAds() {
  return await supabase
    .from('anuncio_tutoria')
    .select(`
      id_anuncio,
      titulo,
      usuario (
        id_usuario,
        nombre_real
      )
    `);
}

async function getAllUsers() {
  return await supabase
    .from('usuario')
    .select('id_usuario, rut, nombre_real, nombre_de_usuario, correo_electronico, rol, suscripcion, pfp');
}

module.exports = {
  getUserById,
  updateUser,
  deleteUser,
  deleteUserImage,
  getAllReviews,
  getReviewsByUser,
  deleteReview,
  getAllBookings,
  getBookingsByStudent,
  getTutorAds,
  getBookingsByTutorAdIds,
  getAllAds,
  getAllUsers
};