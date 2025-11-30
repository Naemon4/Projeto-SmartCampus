require("dotenv").config();
const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { initDB } = require('./config/db'); // só importa initDB

const PORT = process.env.PORT;

// Importando rotas
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const salaRoutes = require('./routes/salaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const andarRoutes = require('./routes/andarRoutes');
const predioRoutes = require('./routes/predioRoutes');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://apis.google.com",
        "https://cdn.jsdelivr.net",
        "https://cdn.tailwindcss.com",
        "https://cdn.jsdelivr.net/npm/chart.js"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  })
);

app.use(helmet.crossOriginResourcePolicy({ policy: "same-origin" }));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(helmet.hidePoweredBy());

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas da API
app.use('/api/agendamento', agendamentoRoutes);
app.use('/api/sala', salaRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/andar', andarRoutes)
app.use('/api/predio', predioRoutes)

// Rotas de páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/pages/index.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/pages/cadastro.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/pages/login.html'));
});

app.get('/agendar', (req, res) =>{
  res.sendFile(path.join(__dirname), 'views/pages/agendar.html')
})

app.get('/cadastrarEspaco', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pages/cadastroLugar.html'))
})

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/pages/dashboard.html'))
})

// Inicializa DB e sobe servidor
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao inicializar banco:', err);
});
