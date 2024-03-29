const express =  require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const TheSchemaUserTable = require("./models/TheSecmaUserTables");
const fs = require("fs");

mongoose.connect("mongodb+srv://root:NewYork4151@cluster0.mmhyyv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
  console.log("Mongoose is runing");

})
.catch(error=>{

console.log(error);

});




const app  = express();

const _portNumber = 3000;
const _portSting = `you were listening on port number http://localhost:${_portNumber} and everything is well`;



app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
    cb(null,"./public/uploads");
    },
    filename:(req,file,cb)=>{
    cb(null,file.filename + "-" + Date.now() + "-" + file.originalname);
    }
});

const upload = multer({storage:storage}).single("image");
    

app.get("/home",async(req,res)=>{
const FindAll = await TheSchemaUserTable.find({});

res.render("index",{FindAll});
    
});

app.get("/show/:id",async(req,res)=>{
const {id} = req.params;
const ShowPost = await TheSchemaUserTable.findById(id);
res.render("show",{ShowPost});


});


app.get("/post",(req,res)=>{

res.render("post");

});


app.post("/home",upload, async(req,res)=>{
const newPost = new TheSchemaUserTable({

    fname:req.body.fname,
    lname:req.body.lname,
    speciesName:req.body.speciesName,
    email:req.body.email,
    phone:req.body.phone,
    image:req.file.filename,
    post:req.body.post,
    

});

   await  newPost.save();
   res.redirect("/home");
    
    });

    app.get('/show/:id/edit', async (req, res) => {
        const { id } = req.params;
        const EditPost = await TheSchemaUserTable.findById(id);
        res.render('edit', { EditPost })
    })
    
    app.put('/show/:id',upload, async (req, res) => {
        const { id } = req.params;
        let New_Iamge = "";
        if(req.file){
          New_Iamge = req.file.filename;
          try{
            fs.unlinkSync("./public/uploads" + req.body.old_image)
          }catch(error){
             console.log(error);

          }
        }else{
            New_Iamge = req.file.filename;

        }
        const EditPostById = await TheSchemaUserTable.findByIdAndUpdate(id, {
            fname:req.body.fname,
            lname:req.body.lname,
            speciesName:req.body.speciesName,
            email:req.body.email,
            phone:req.body.phone,
            image: New_Iamge,
            post:req.body.post,

        }, { runValidators: true, new: true });
        res.redirect(`/show/${EditPostById._id}`);
    })
    

    app.delete("/show/:id",async(req,res)=>{
     const {id} = req.params;
     const DeletePost = await TheSchemaUserTable.findByIdAndDelete(id);
     res.redirect("/home");


    });
    


app.listen(_portNumber,(req,res)=>{
console.log(_portSting);


});