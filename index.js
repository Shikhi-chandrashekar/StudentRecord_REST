require('dotenv').config(); 

const express=require("express");
const app=express();
const path=require("path");
const PORT=process.env.PORT||3000;
const {v4:uuidv4}=require("uuid");
const methodOverride=require("method-override");
const studentRecord=require("./models/studentRecord");
const mongodbUri = process.env.MONGODB_URI;
const mongoose=require("mongoose");

main().then((res)=>{
    console.log("Connection Successful!");
}).catch(err => console.log(err));
async function main(){
    await mongoose.connect(mongodbUri);
}

app.use(methodOverride("_method"));


//to parse data of post req
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));





//index route
app.get("/records",async(req,res)=>{

    try{
        let records= await studentRecord.find();
         res.render("index.ejs",{records})
    }catch(err){
        next(err);
    }


})


//new route
app.get("/records/new",(req,res)=>{
    res.render("new.ejs")
})


//create route
app.post("/records",async(req,res)=>{
try{
    let {name,usn,email,marks,status}=req.body;

   
    let newRecord= new studentRecord({
        name:name,
        usn:usn,
        email:email,
        marks:marks,
        status:status
    })
  
    newRecord.save();
   
    res.redirect("/records");
}catch(err){
    next(err);
}


})

//ASYNCWRAP  to avoid try catch block
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err) => next(err));
    };
}


//show route
app.post("/records/:id",asyncWrap(async(req,res)=>{
    
        let {id}=req.params;
        let record= await studentRecord.findById(id);
        if(!record){
            next( new ExpressError(404, "Record nor found"))  
          }
         res.render("show.ejs",{record});
 
}))


//edit route
app.post("/records/:id/edit", asyncWrap(async (req,res)=>{
   
        let {id}=req.params;
        let record=await studentRecord.findById(id);
        res.render("edit.ejs",{record});
}))



//update route 
app.patch("/records/:id", asyncWrap(async(req, res) => {
    const { id } = req.params;
    let updates = req.body;

    let updatedRecord = await studentRecord.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
    );

    if (!updatedRecord) {
        return res.status(404).send("Record not found");
    }

    res.redirect("/records");
}));


//delete route
app.delete("/records/:id",asyncWrap(async(req,res)=>{
    let {id}=req.params;
   await studentRecord.findByIdAndDelete(id);
    res.redirect("/records");
}))

//Takes in an error object err (usually from a failed .save() or findByIdAndUpdate() in Mongoose).
const haldleValidationError=(err)=>{
    console.log("This was a Validation Error")
    console.dir(err.message);
    return err;
}


//Middleware to print error name
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
       err= haldleValidationError(err);
    }
    next(err)
})


//Error Handling Middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error Occured"}=err;
    res.status(status).send(message);
})


app.listen(PORT,()=>{
    console.log(` app is listening to port ${PORT}`);
})