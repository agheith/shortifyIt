const mongoose = require('mongoose');
const validators = require('mongoose-validators');
const Schema = mongoose.Schema;

const CounterSchema = require('./counter');

const LinkSchema = new Schema({
  _id: { type: Number },
  destination: { type: String, required: true, validate: validators.isURL() }
}, {
  timestamps: true,
  collection: 'links'
});

LinkSchema.pre('save', function(next){
  var doc = this;
  CounterSchema.findByIdAndUpdate({ _id: 'url_count' }, { $inc: { count: 1 } }, function(err, counter) {
    if(err) return next(err);
    doc._id = counter.count;
    next();
  });
});

module.exports  = mongoose.model('LinkModel', LinkSchema);
