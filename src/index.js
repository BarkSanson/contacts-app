const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');

const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
require('./config/passport');


// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Views set-up
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    extname: 'hbs',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: 'main',
}));
app.set('view engine', '.hbs');

// Database connection
require('./db');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/contacts', require('./routes/contacts'));

// Listening!
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
})