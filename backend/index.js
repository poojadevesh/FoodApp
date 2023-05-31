const express = require("express");
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const userRoute = require('./Routes/user')
const displayroute =require('./Routes/Displaydata')
const orderRoute= require('./Routes/orderData')
app.use('/user', userRoute)
app.use('/display', displayroute)
app.use('/order',orderRoute)


const mongodb = require('./models/db')

mongodb().then(() => {
    const port = 4000;
    app.listen(port, () => {
        console.log(`connected with port ${port}`);
    });
}).catch(error => {
    console.error('Failed to connect to MongoDB:', error)
})
