require('dotenv').config();

const mongoose =require('mongoose');
mongoose.set("strictQuery", false);


function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL,
        {useNewUrlParser: true, useUnifiedTopology: true,}
        );

        const connection= mongoose.connection
        connection.once('open',()=>{
            console.log("Database is connected");

        })

}
module.exports=connectDB;
