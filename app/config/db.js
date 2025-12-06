var mongoose = require('mongoose');

module.exports = function configDb(){
  var uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Portfolio';
  mongoose.set('strictQuery', true);
  mongoose.connect(uri).then(function(){
    console.log(' MongoDB connected:', mongoose.connection.name);
  }).catch(function(err){
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
};
