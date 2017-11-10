const
  express = require('express'),
  app = express(),
  path = require('path'),
  favicon = require('serve-favicon'),
  mongoose = require('mongoose'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  dotenv = require('dotenv').load({silent: true}),
  ejs = require('ejs'),
  ejsLayouts = require('express-ejs-layouts'),
  flash = require('connect-flash'),
  session = require('express-session'),
  MongoDBStore = require('connect-mongodb-session')(session),
  passport = require('passport'),
  methodOverride = require('method-override'),
  passportConfig = require('./config/passport.js'),
  userRoutes = require('./routes/users.js'),
  newsletterRoutes = require('./routes/subscribe.js')

  var braintree = require('braintree');

//environment port
  port = process.env.PORT || 3000,
  mongoConnectionString = process.env.MONGODB_URL || 'mongodb://localhost/gmstem'

//mongoose connection
  mongoose.connect(mongoConnectionString, (err) => {
    console.log(err || "Connected to MongoDB")
  })

//Will store session information as a 'sessions' collection in Mongo
  const store = new MongoDBStore({
    uri: mongoConnectionString,
    collection: 'sessions'
  });

//Middleware
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(flash())


//ejs configuration
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs')
  app.use(methodOverride('_method'))
  app.use(ejsLayouts)
  app.use(express.static(__dirname + '/public'))

  app.use(session({
    secret: 'brian',
    cookie: {maxAge: 1000000},
    resave: true,
    saveUninitialized: false,
    store: store
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    app.locals.currentUser = req.user
    app.locals.isLoggedIn = !!req.user
    next()
  })

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/programs', (req, res) => {
  res.render('programs')
})

app.get('/spotlight', (req, res) => {
  res.render('spotlight')
})

app.get('/contact', (req, res) => {
  res.render('contact')
})

app.get('/donate', (req, res) => {
  res.render('donate')
})

app.get('/profile', (req, res) => {
  res.render('profile')
})

app.use('/', userRoutes)
app.use('/', newsletterRoutes)

var gateway = braintree.connect({
    environment:  braintree.Environment.Production,
    merchantId:   process.env.BRAINTREE_MERCHANT_ID,
    publicKey:    process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:   process.env.BRAINTREE_PRIVATE_KEY
});

var parseUrlEnconded = bodyParser.urlencoded({
  extended: false
});

app.get('/', function (request, response) {

  gateway.clientToken.generate({}, function (err, res) {
    response.render('index', {
      clientToken: res.clientToken
    });
  });

});

app.post('/process', parseUrlEnconded, function (request, response) {

  // Use the payment method nonce here
  var nonceFromTheClient = request.body.paymentMethodNonce;
  console.log(request.body);

  var newTransaction = gateway.transaction.sale({
    amount: request.body.amount,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, function(error, result) {
      if (result) {
         console.log(result.transaction)
        response.send(result);
      } else {
        response.status(500).send(error);
        console.log(error)
      }
  });

});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(port, (err) => {
  console.log(err || `Server listening on port ${port}. 👍`)
})
