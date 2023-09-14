// const mongoose = require('mongoose');

// // Connect to the Mongodb database
// mongoose.connect(process.env.DATABASE_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
  
//   // Check for connection
//   const db = mongoose.connection;
//   db.on('error', (error) => console.error(error));
//   db.once('open', () => console.log('Connected to database'));

//   module.exports = connectDB

const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        // mongodb connection string
        const con = await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connected: ${con.connection.host}`);
        }catch(err){
        console.log(err);
        process.exit(1);
        }
}

module.exports = connectDB