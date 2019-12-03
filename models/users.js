const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //because unique true does not act as a validator. It checks the data before saving in the database

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true //not as validator
    },
    password:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
      type: String,
      required: true
    },
    table_no:{
      type: String,
    },
    seat_no:{
      type: String,
    },
    coming: {
      type: String,
      default: 'not confirmed'
    },
    accountType: {
      type: String,
      default: 'guest'
    },
    companions:
        [
          {
            firstname: String,
            lastname: String,
            table_no: String,
            seat_no: String,
            coming: {
              type: String,
              default: 'not confirmed'
            },
          }
        ]




});

userSchema.plugin(uniqueValidator);
//MODEL
module.exports = mongoose.model('User', userSchema);
