const mongoose = require('mongoose')

const mongoUri ='mongodb://127.0.0.1:27017/Gofood'

const mongodb = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected to MongoDB')
    const fetched_data = await mongoose.connection.db.collection('fooditems')
    fetched_data.find({}).toArray(async function(err, data) {
      const foodCategory = await mongoose.connection.db.collection('foodcatergory')
      foodCategory.find({}).toArray(async function(err, catdata) {
        if (err) console.log(err)
        else {
          global.fooditems = data
          global.foodcatergory = catdata
        }
      })
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
  }
}

module.exports = mongodb
