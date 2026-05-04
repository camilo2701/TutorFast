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

module.exports = {
  createTutoringAd,
  getTutoringAdById,
  getReviewsByAdId,
  createTutoria
};