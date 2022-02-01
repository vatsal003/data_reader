const mongoose = require('mongoose')


mongoose.connect(process.env.MONGOURL)
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));
