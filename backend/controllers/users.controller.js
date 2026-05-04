const UserModel = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

async function getAllUsers(req, res) {
  const { data, error } = await UserModel.getAllUsers();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
}

async function getUserProfile(req, res) {
  const idUsuario = Number(req.params.id);

  if (!idUsuario) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }

  const { data: usuario, error: usuarioError } = await UserModel.getUserById(idUsuario);

  if (usuarioError) {
    return res.status(500).json({ error: usuarioError.message });
  }

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const profile = {
    user: {
      id: usuario.id_usuario,
      name: usuario.nombre_real,
      username: usuario.nombre_de_usuario,
      role:
        usuario.rol === 0 ? 'student' :
        usuario.rol === 1 ? 'tutor' :
        usuario.rol === 2 ? 'admin' :
        'unknown',
      suscripcion: usuario.suscripcion,
      image: usuario.pfp
    },
    reviews: [],
    tutorSessions: [],
    tutorReviews: []
  };

  if (usuario.rol === 0) {
    const { data: reviews, error } = await UserModel.getStudentReviews(idUsuario);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    profile.reviews = reviews.map((review) => ({
      tutor: review.anuncio_tutoria?.usuario?.nombre_real || 'Tutor no encontrado',
      subject: review.anuncio_tutoria?.titulo || 'Sin título',
      comment: review.contenido_review || '',
      rating: Number(review.calificacion)
    }));
  }

  if (usuario.rol === 1) {
    const { data: anuncios, error: anunciosError } = await UserModel.getTutorAds(idUsuario);

    if (anunciosError) {
      return res.status(500).json({ error: anunciosError.message });
    }

    profile.tutorSessions = anuncios.map((anuncio) => ({
      id: anuncio.id_anuncio,
      title: anuncio.titulo
    }));

    const idsAnuncios = anuncios.map((anuncio) => anuncio.id_anuncio);

    if (idsAnuncios.length > 0) {
      const { data: tutorReviews, error: tutorReviewsError } = await UserModel.getTutorReviews(idsAnuncios);

      if (tutorReviewsError) {
        return res.status(500).json({ error: tutorReviewsError.message });
      }

      tutorReviews.forEach((review) => {
        profile.tutorReviews.push({
          tutor: review.usuario?.nombre_real || 'Estudiante no encontrado',
          subject: review.anuncio_tutoria?.titulo || 'Sin título',
          comment: review.contenido_review || '',
          rating: Number(review.calificacion)
        });
      });
    }
  }

  res.json(profile);
}

async function createUser(req, res) {
  try {
    const {
      nombre_real,
      nombre_de_usuario,
      correo_electronico,
      contrasena,
      rol,
      rut
    } = req.body;

    if (!nombre_real || !nombre_de_usuario || !correo_electronico || !contrasena || rol === undefined) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const { data: existingUser } = await UserModel.getUserByEmail(correo_electronico);

    if (existingUser) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    let pfpUrl = null;

    if (req.file) {
      const file = req.file;
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (uploadError) {
        console.error('Error subiendo imagen:', uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      pfpUrl = publicUrlData.publicUrl;
    }

    const newUser = {
      nombre_real,
      nombre_de_usuario,
      correo_electronico,
      contrasena: hashedPassword,
      rol,
      rut,
      suscripcion: rol === 1 ? 1 : 0,
      pfp: pfpUrl
    };

    const jwt = require('jsonwebtoken');

    const { data, error } = await UserModel.createUser(newUser);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const token = jwt.sign(
    {
        id_usuario: data.id_usuario,
        rol: data.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '10m' }
    );

    res.status(201).json({
      message: 'Usuario creado correctamente',
      token,
      user: {
        id_usuario: data.id_usuario,
        nombre_real: data.nombre_real,
        nombre_de_usuario: data.nombre_de_usuario,
        correo_electronico: data.correo_electronico,
        rol: data.rol,
        suscripcion: data.suscripcion,
        pfp: data.pfp
      }
    });

  } catch (error) {
    console.error('Error en createUser:', error);
    res.status(500).json({ error: error.message });
  }
}

async function loginUser(req, res) {
  const { correo_electronico, contrasena } = req.body;

  if (!correo_electronico || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  const { data: usuario, error } = await UserModel.getUserByEmail(correo_electronico);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

  if (!passwordValida) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '10m' }
  );

  res.json({
    message: 'Inicio de sesión correcto',
    token,
    user: {
      id_usuario: usuario.id_usuario,
      nombre_real: usuario.nombre_real,
      nombre_de_usuario: usuario.nombre_de_usuario,
      correo_electronico: usuario.correo_electronico,
      suscripcion: usuario.suscripcion,
      rol: usuario.rol
    }
  });
}

module.exports = {
  getAllUsers,
  getUserProfile,
  createUser,
  loginUser
};