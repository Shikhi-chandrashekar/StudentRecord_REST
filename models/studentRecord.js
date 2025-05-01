const mongoose=require("mongoose");

const stdSchema=new mongoose.Schema({

 name:{
    type:String,
    required:true,
    maxLength:20
 },
 usn:{
    type:Number,
    required:true,
    maxLength:10
 },
 email:{
    type:String,
    required:true,
 },
 marks:{
    type:Number,
    min:0,
    max:100
 },
 status:{
    type:String,
    enum:["pass","fail"]
 }


})

const Stud= mongoose.model("Stud",stdSchema);

module.exports=Stud;