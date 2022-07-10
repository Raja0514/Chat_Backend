const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  
});
const model = mongoose.model("Userdata", blogSchema);
module.exports = model;


