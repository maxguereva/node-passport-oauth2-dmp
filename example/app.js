var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , YsanceStrategy = require('../lib/index').Strategy;

var YSANCE_CLIENT_ID = "50bec69ced9e8e3943116c5f8a";
var YSANCE_CLIENT_SECRET = "9c2aee4724aaec9e05cf3258b131573b0718e5ffbcfacefc";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new YsanceStrategy({
    consumerKey: YSANCE_CLIENT_ID,
    consumerSecret: YSANCE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/ysance/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/auth/ysance',
  passport.authenticate('Ysance'),
  function(req, res){
    console.log('you should not get here!')
  });


app.get('/auth/ysance/callback', 
  passport.authenticate('Ysance', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}