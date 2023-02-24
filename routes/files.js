const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file');
const {v4:uuid4}=require('uuid');


const storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
})

let upload=multer({
    storage,
    limits:{fileSize:100000000}
}).single('myfile');


router.post('/',(req,res)=>{
     //store in local
     
     upload(req,res,async (err)=>{
        //validate 

        if(!req.file){
            return res.json({err:'all field are required. '})
        }     

        if(err){
            return res.status(500).send({error:err.message})
        }
        // store in database
        const file=new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size

        })

        const response= await file.save();
        return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})

     })


     


     //res
})

router.post('/send',async (req,res)=>{
   
  const {uuid,emailTo,emailFrom}=req.body;

 //validate data
  if(!uuid || !emailFrom ||!emailTo)
      return res.status(422).send({error:"All field required. "});
    

    //  get data from database
    const file= await File.findOne({uuid:uuid});

    if(file.sender)
       return res.status(422).send({error:"we already send email. "});

    file.sender=emailFrom;
    file.reciever=emailTo;   

    const response=await file.save();

    // send email
    const sendMail=require('../services/emailService');

    sendMail({
        from:emailFrom,
        to:emailTo,
        text:`${emailFrom} shared file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+' KB',
            expires:'24 hours'
        })
    })
    return res.send({sucess:true});

})

module.exports=router;