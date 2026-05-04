const supabase = require('../config/db');

async function createTutoringAd(adData) {
  return await supabase
    .from('anuncio_tutoria')
    .insert([adData])
    .select()
    .single();
}

module.exports = {
  createTutoringAd
};