'use strict';

let mongoose = require('mongoose');  

var userSchema = new mongoose.Schema({  
  name: {
      type: String
  },
  password: {
      type: String
  }
});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');