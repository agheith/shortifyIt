const express = require('express');
const app = express();
const path = require('path');
const bp = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require("mongodb");
const isURL = require('validator/lib/isURL');
const base62 = require('./utils/base62.js');
const keys = require('./config/keys.js');

const port = process.env.PORT || 3000;

/* Database Connection */
var LinkModel = require('./models/link');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/shortifyIt');
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
  var userUrl = req.body.url;
  console.log(isURL(req.body.url));
  var shortUrl = '';
  if (!/^(f|ht)tps?:\/\//i.test(userUrl)) {
      userUrl = "http://" + userUrl;
  }
  //Check if url already exits in DB
  if(userUrl && isURL(userUrl)) {
    // console.log(userUrl);
    LinkModel.findOne({ destination: userUrl }, function(err, doc) {
      if(doc) {
        //URL has already been shortned
        // base62 encode the unique _id and create the shortUrl
        shortUrl = `http://localhost:3000/${base62.encode(doc._id)}`;


        res.send({
          'shortUrl': shortUrl,
          'userUrl': userUrl
         });

      } else {

        //create a new entry
        var newUrl = LinkModel({
          destination: userUrl
        });

        //save the new link
        newUrl.save(function(err) {
          if(err) {
            console.log(err);
          }

          //create the shortUrl
          shortUrl = `http://localhost:3000/${base62.encode(newUrl._id)}`;
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

/*----------------- POST Route - Original Linnk  -----------------*/
app.post('/api/:longUrl', function(req, res){
  var userLongUrl = req.body.longUrl.slice(22);

  console.log('req.body.encoded_id is ', userLongUrl);

  var id = base62.decode(userLongUrl);

  console.log('id ', id);

  // check if url already exists in database
  LinkModel.findOne({_id: id}, function (err, doc){
    if (doc) {
      console.log(doc);
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
