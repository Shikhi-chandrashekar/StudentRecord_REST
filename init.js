const mongoose=require("mongoose");
const mongodbUri = process.env.MONGODB_URI;

main().then((res)=>{
    console.log("Connection Successful!");
}).catch(err => console.log(err));
async function main(){
    await mongoose.connect(mongodbUri);
}

let studentRecord=require("./models/studentRecord");


let records=[
    {
    name:"Shikhi",
    usn:198,
    email:"shikhichitte@gmail.com",
    marks:88,
    status:"pass"
    },
    {
        name:"Preeti",
        usn:193,
        email:"preeti@gmail.com",
        marks:98,
        status:"pass"
    },
    {
        name:"Rachana",
        usn:261,
        email:"rachana@gmail.com",
        marks:40,
        status:"fail"
    }
]


studentRecord.insertMany(records);