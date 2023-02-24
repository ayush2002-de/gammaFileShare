const express=require('express');
const app= express();
const connectDB=require('./config/db.js');
const path=require('path');
const cors=require('cors');

//template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());

//cors
const corsOption={
    origin:process.env.ALLOW_CLIENT.split(",")
}
app.use(cors(corsOption));

const PORT=process.env.PORT || 3000;
connectDB();

app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
    console.log(`app start in port no ${PORT}`);
})