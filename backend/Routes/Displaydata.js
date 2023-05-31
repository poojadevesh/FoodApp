const express= require('express')
const router = express();
const mongoose = require('mongoose')


  
router.post('/fooddata', async (req, res) => {
    try {
      const fooditems = await mongoose.connection.db.collection('fooditems').find({}).toArray();
      const foodcatergory = await mongoose.connection.db.collection('foodcatergory').find({}).toArray();
      res.send([fooditems, foodcatergory]);
    } catch (error) {
      console.log(error);
      res.send('server error');
    }
  });
  

module.exports = router;