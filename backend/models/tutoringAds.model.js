const supabase = require('../config/db');

async function createTutoringAd(adData) {
  return await supabase
    .from('anuncio_tutoria')
    .insert([adData])
    .select()
    .single();
}

async function getTutoringAdById(idAnuncio) {
  return await supabase
    .from('anuncio_tutoria')
    .select(`
      id_anuncio,
      precio_por_hora,
      titulo,
      descripcion,
      asignatura,
      activo,
      boosted,
      modality,
      usuario (
        id_usuario,
        nombre_real,
        pfp
      )
    `)
    .eq('id_anuncio', idAnuncio)
    .maybeSingle();
}

async function getReviewsByAdId(idAnuncio) {
  return await supabase
    .from('review')
    .select(`
      id_review,
      calificacion,
      contenido_review,
      usuario (
        id_usuario,
        nombre_real
      )
    `)
    .eq('id_anuncio', idAnuncio);
}

async function createTutoria(tutoriaData) {
  return await supabase
    .from('tutoria')
    .insert([tutoriaData])
    .select()
    .single();
}

async function getAllTutoringAds() {
  return await supabase
    .from('anuncio_tutoria')
    .select(`
      id_anuncio,
      precio_por_hora,
      titulo,
      descripcion,
      asignatura,
      boosted,
      modality,
      activo,
      usuario (
        id_usuario,
        nombre_real,
        pfp
      ),
      review (
        calificacion
      )
    `)
    .eq('activo', 1);
}

async function getAllConfirmedTutorias() {
  return await supabase
    .from('tutoria')
    .select(`
      id_tutoria,
      id_anuncio,
      anuncio_tutoria (
        id_anuncio,
        usuario (
          id_usuario,
          nombre_real,
          pfp
        )
      )
    `)
    .eq('verificacion_pago', 1);
}

module.exports = {
  createTutoringAd,
  getTutoringAdById,
  getReviewsByAdId,
  createTutoria,
  getAllTutoringAds,
  getAllConfirmedTutorias
};