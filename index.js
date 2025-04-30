let express=require("express");
let app=express();
let path=require("path");
let PORT=3000;
let {v4:uuidv4}=require("uuid");
let methodOverride=require("method-override");
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"))
app.use(express.static(path.join(__dirname,"public")));



let records=[
    {
    id:uuidv4(),
    name:"Shikhi",
    usn:198,
    email:"shikhichitte@gmail.com",
    marks:88,
    status:"pass"
    },
    {
        id:uuidv4(),
        name:"Preeti",
        usn:193,
        email:"preeti@gmail.com",
        marks:98,
        status:"pass"
    },
    {
        id:uuidv4(),
        name:"Rachana",
        usn:261,
        email:"rachana@gmail.com",
        marks:40,
        status:"fail"
    }
]



app.get("/records",(req,res)=>{
    res.render("index.ejs",{records})
})

app.get("/records/new",(req,res)=>{
    res.render("new.ejs")
})


app.post("/records",(req,res)=>{
    let {name,usn,email,marks,status}=req.body;
    let id=uuidv4();
    records.push({id,usn,name,email,marks,status});
    res.redirect("/records")
})


app.post("/records/:id",(req,res)=>{
    let {id}=req.params;
   let record=records.find((r)=> id===r.id);
   
    res.render("show.ejs",{record});
})

app.post("/records/:id/edit",(req,res)=>{
    const {id}=req.params;
    let record=records.find((r)=>id===r.id);
    res.render("edit.ejs",{record});
})

app.patch("/records/:id", (req, res) => {
    const { id } = req.params;
    const { name, usn, email, marks, status } = req.body;

    let record = records.find((r) => r.id === id);

    if (record) {
        record.name = name || record.name;
        record.usn = usn || record.usn;
        record.email = email || record.email;
        record.marks = marks || record.marks;
        record.status = status || record.status;
    }

    res.redirect("/records");
});



app.delete("/records/:id",(req,res)=>{
    let {id}=req.params;
    records=records.filter((r)=> id!=r.id);
    res.redirect("/records");
})


app.listen(PORT,()=>{
    console.log(` app is listening to port ${PORT}`);
})