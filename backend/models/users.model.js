const supabase = require('../config/db');

async function getAllUsers() {
  return await supabase
    .from('usuario')
    .select('*');
}

async function getUserById(idUsuario) {
  return await supabase
    .from('usuario')
    .select('id_usuario, nombre_real, nombre_de_usuario, rol, suscripcion, pfp')
    .eq('id_usuario', idUsuario)
    .maybeSingle();
}

async function getStudentReviews(idUsuario) {
  return await supabase
    .from('review')
    .select(`
      calificacion,
      contenido_review,
      anuncio_tutoria (
        titulo,
        usuario (
          nombre_real
        )
      )
    `)
    .eq('id_usuario', idUsuario);
}

async function getTutorAds(idUsuario) {
  return await supabase
    .from('anuncio_tutoria')
    .select('id_anuncio, titulo')
    .eq('id_usuario', idUsuario);
}

async function getTutorReviews(idsAnuncios) {
  return await supabase
    .from('review')
    .select(`
      id_review,
      calificacion,
      contenido_review,
      usuario (
        nombre_real
      ),
      anuncio_tutoria (
        id_anuncio,
        titulo
      )
    `)
    .in('id_anuncio', idsAnuncios);
}

async function getUserByEmail(correo) {
  return await supabase
    .from('usuario')
    .select('*')
    .eq('correo_electronico', correo)
    .maybeSingle();
}

async function createUser(userData) {
  return await supabase
    .from('usuario')
    .insert([userData])
    .select()
    .single();
}

async function getUserByEmail(correo) {
  return await supabase
    .from('usuario')
    .select('*')
    .eq('correo_electronico', correo)
    .maybeSingle();
}

module.exports = {
  getAllUsers,
  getUserById,
  getStudentReviews,
  getTutorAds,
  getTutorReviews,
  getUserByEmail,
  createUser
};