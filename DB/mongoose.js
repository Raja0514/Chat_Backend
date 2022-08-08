const mongoose=require('mongoose')
mongoose
 .connect('mongodb://root:root@cluster0-shard-00-00.yf0vj.mongodb.net:27017,cluster0-shard-00-01.yf0vj.mongodb.net:27017,cluster0-shard-00-02.yf0vj.mongodb.net:27017/?ssl=true&replicaSet=atlas-hhd35b-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 })
 .then((db) => console.log("DB Connected"))
 .catch((err) => console.log(err));

 module.exports=mongoose;