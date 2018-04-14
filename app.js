const express = require('express');
const app = express();
const path = require('path');
const bp = require('body-parser');
const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const { encode, decode } = require('./utils/base62.js');
const { validateUrl, validateEmail } = require('./utils/validation-helpers.js');

const port = process.env.PORT || 3000;

/* Database Connection */
const LinkModel = require('./models/link');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortifyIt');
/* Database Connection */


app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

/*----------------- Homepage  -----------------*/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
/*----------------- Homepage Ends -----------------*/


/*----------------- POST Route- Create a shor URL  -----------------*/
app.post('/api/short', (req, res) => {

  let shortUrl = '';
  let userUrl;
  let domain = req.headers.host;

  if(validateUrl(req.body.url)) {
    userUrl = req.body.url;
    console.log('its a link', userUrl);
  } else if (!/^(f|ht)tps?:\/\//i.test(req.body.url) && !validateEmail(req.body.url)) {
    userUrl = 'http://' + req.body.url;
    console.log('its a link with embedded http', userUrl);
  } else if (validateEmail(req.body.url)) {
    userUrl = req.body.url;
    console.log('its an email', userUrl);
  }

  //Check if url already exits in DB
  if(userUrl && isURL(userUrl) || validateEmail(userUrl)) {
    LinkModel.findOne({ destination: userUrl }, function(err, doc) {
      if(doc) {
        //URL has already been shortned
        // base62 encode the unique _id and create the shortUrl
        console.log(domain);
        shortUrl = `${domain}/${encode(doc._id)}`;


        res.send({
          'shortUrl': shortUrl,
          'userUrl': userUrl
         });

      } else {

        //create a new entry
        const newUrl = LinkModel({
          destination: userUrl
        });

        //save the new link
        newUrl.save(function(err) {
          if(err) {
            console.log(err);
          }

          //create the shortUrl
          shortUrl = `http://${domain}/${encode(newUrl._id)}`;
          console.log('second res', shortUrl);
          res.send( { 'shortUrl': shortUrl, userUrl: userUrl  } )
        });
      }
    });
  } else {
    res.status(400).json({ message: 'Url is in wrong format'})
  }
});
/*----------------- POST Route Ends  -----------------*/

/*----------------- Get Route to redirect  -----------------*/
app.get('/:encoded_id', function(req, res){
  let base62Id = req.params.encoded_id;
  let id = decode(base62Id);
  let domain = req.headers.host;
  // check if url already exists in database
  LinkModel.findOne({_id: id}, function (err, doc){
    if (doc) {
      if(validateEmail(doc.destination)) {
        res.redirect(`mailto:${doc.destination}`)
      } else {
        // found an entry in the DB, redirect the user to their destination
        res.redirect(doc.destination);
      }
    } else {
      // nothing found, take 'em home
      res.redirect(`${domain}`);
    }
  });

});
/*----------------- Get Route to redirect  -----------------*/

/*----------------- POST Route - Original Linnk  -----------------*/
app.post('/api/:longUrl', function(req, res){
  let domain = req.headers.host;
  // domain = 'http://' + domain + '/';
  console.log(domain);
  let userLongUrl = req.body.longUrl.slice(domain.length);

  console.log('req.body.encoded_id is ', userLongUrl);
  // console.log(req.headers.host);

  let id = decode(userLongUrl);

  console.log('id ', id);

  // check if url already exists in database
  LinkModel.findOne({_id: id}, function (err, doc){
    if (doc) {
      userUrl = doc.destination;
      res.send({ userUrl: userUrl })
      // found an entry in the DB, redirect the user to their destination
    } else {
      // nothing found, take 'em home
      // res.redirect('http://localhost:3000/');
      res.status(400).json({ message: 'Url is in wrong format'});
    }
  });
});
/*----------------- POST Route Ends - Original Linnk  -----------------*/

app.listen(port, () => {
  console.log(`Started up at post ${port}`);
})
