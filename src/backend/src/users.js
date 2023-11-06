const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const usersRouter = express.Router();
const db = require('./db');


// Estratégia local de autenticação
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'senha'
    },

    async (email, senha, done) =>{
        try{
            // Confirmando se o e-mail é encontrado
            const user = await db.query('SELECT * FROM registro WHERE email = $1', [email]);
            if(!user.rows.length){
                return done(null, false, {message: 'User not found'});
            }

            // Confirmando a senha
            const isPasswordValid = await bcrypt.compare(senha, user.rows[0].senha);
            if(!isPasswordValid){
                return done(null, false, {message: 'Invalid password'});
            }

            // Caso passe nos dois testes
            return done(null, user.rows[0]);
        }catch(error){
                return done(error);
            }
    }
));

// Configurar serializerUser e deserializeUser
passport.serializeUser((user, done) =>{
    done(null, user.email);
});

passport.deserializeUser(async(email, done) =>{
    try{
        console.log(email);
        const user = await db.query('SELECT * FROM registro WHERE email = $1', [email]);
        done(null, user.rows[0]);
    } catch(error){
        done(error);
    };
});

// Middlewares
usersRouter.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

usersRouter.use(passport.initialize());
usersRouter.use(passport.session());

// Rota de login
usersRouter.post('/login', passport.authenticate('local'), async (req, res, next) => {
    try{
        const sessionId = req.sessionID; //recuperando session do login
        const userId = req.user.id; // pegando id do usuario

        await db.query('UPDATE registro SET sessao_id = $1 WHERE id = $2', [sessionId, userId]);

        res.json({ message: 'Login successful', user: req.user }); 
    } catch (error) {
        console.error('Error updating session Id', error);
        res.status(500).json({error: 'An error occurred'});
    }
});


// Rota para retornar perfil do usuário caso o login tenha sido autenticado
usersRouter.get('/profile', (req, res, next) =>{
    if(req.isAuthenticated()){
        res.json({user: req.user})
    }else{
        res.status(401).json({message: 'Unauthorized'});
    }
});

// Rota para logout
usersRouter.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session', err);
        }
        res.redirect('/users'); // esta redirecionado para get usuarios
    });
});

// Rota para obter todos os usuários
usersRouter.get('/', (req, res, next) => {
    db.query('SELECT * FROM registro')
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({error: 'An error occurred'});
        });
});

// users by ID
usersRouter.get('/:id', (req, res, next) => {
    const query = 'SELECT * FROM registro WHERE id = $1';
    const values = [req.params.id];

    db.query(query, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'An error occurred' });
        });
});

// Rota para registrar novo usuário
usersRouter.post('/', async (req, res, next) => {
    try {
        const { nome, email, senha } = req.body;
        
        console.log('Nome:', nome);
        console.log('Email:', email);
        console.log('Senha:', senha);

        // Gerar salt
        const salt = await bcrypt.genSalt(10);

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, salt);

        const query = 'INSERT INTO registro (nome, email, senha) VALUES ($1, $2, $3)';
        const values = [nome, email, hashedPassword];

        await db.query(query, values);

        res.status(201).json('User registered');
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = usersRouter;