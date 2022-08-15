// connect to db
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // to take out deprication warning
    useFindAndModify: false
})


