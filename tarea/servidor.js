// Importar los módulos necesarios
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./model/UserModel');

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/peliculas')
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
  });

// Configurar Passport.js
passport.use(new LocalStrategy(
  { usernameField: 'username' },
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Usuario incorrecto.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Contraseña incorrecta.' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Configurar Express
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'db_mon')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar express-session
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false
}));

// Configurar connect-flash middleware
app.use(flash());

// Inicializar Passport y sesión
app.use(passport.initialize());
app.use(passport.session());

// Definir rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'db_mon', 'login.html'), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      console.log('Se ha enviado el archivo login.html correctamente.');
    }
  });
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'db_mon', 'login.html'), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      console.log('Se ha enviado el archivo login.html correctamente.');
    }
  });
});



app.get('/peliculas', (req, res) => {
  fs.readFile(path.join(__dirname, 'db_mon', 'peliculas.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el archivo peliculas.json');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/peliculas', // Redirigir al catálogo después del inicio de sesión exitoso
  failureRedirect: '/login', // Redirigir de nuevo a la página de inicio de sesión en caso de fallo
  failureFlash: true
}));


app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
    } else {
      const newUser = new User({
        username: username,
        password: hashedPassword
      });
      newUser.save((err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al registrar el usuario');
        } else {
          res.redirect('/login');
        }
      });
    }
  });
});

app.get('/profile', isAuthenticated, (req, res) => {
  res.send('Esta es la página de perfil');
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor web iniciado en http://localhost:${PORT}/`);
});
