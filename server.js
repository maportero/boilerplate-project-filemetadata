var express = require('express');
var cors = require('cors');
require('dotenv').config()
const api = require('./routes/api.js');
var app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './public/data/uploads/' });
const TIMEOUT = 10000;

const enableCORS = function (req, res, next) {
  if (!process.env.DISABLE_XORIGIN) {
    const allowedOrigins = ["https://www.freecodecamp.org"];
    const origin = req.headers.origin;
    if (!process.env.XORIGIN_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(req.method);
      console.log( req.url);
      res.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      });
    }
  }
  next();
};
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

router.get('/test', (req, res, next) => {
    console.log('test');
    return res.send({message:  'test'});
})

const FileAnalyse = api.FileAnalyse;
router.post('/api/fileanalyse2', upload.single('upfile') ,( req, res, next ) => {
    let t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
      const file = req.file;
      FileAnalyse( file, (err,result) => {
        clearTimeout(t);
        if (err) return next(err);
        res.json(result);  
      });
  });

app.post('/api/fileanalyse', multer().single('upfile') ,( req, res ) => {

      const file = req.file;
      const result = {
        name: file.originalname,
        type: file.mimetype,
        size: file.size
      }
      res.json(result);  

  });

//app.use('/', enableCORS, router);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
