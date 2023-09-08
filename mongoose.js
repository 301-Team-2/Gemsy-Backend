const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://joshshea44:b3x2u1qbrCSwSKbg@cluster0.fjkgyrj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
