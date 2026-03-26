import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { configDotenv } from "dotenv";

configDotenv.config()

const app = express();

app.use(cors());
app.use(express.json());



// MongoDB connection
mongoose.connect(process.env.mongoose_URL)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err));


// USER SCHEMA
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  password: String,

  exam: {
    jamb: Boolean,
    waec: Boolean,
    neco: Boolean
  },

  examCode: {
    jamb: String,
    waec: String,
    neco: String
  }
});

const User = mongoose.model("User", userSchema);



// CREATE USER
app.post("/users", async (req,res)=>{
  try{

    const user = new User(req.body);

    const savedUser = await user.save();

    res.json(savedUser);

  }catch(err){
    res.status(500).json(err);
  }
});



// GET ALL USERS
app.get("/users", async (req,res)=>{

  const users = await User.find();

  res.json(users);

  console.log(users)

});



// GET SINGLE USER
app.get("/users/:id", async (req,res)=>{

  const user = await User.findById(req.params.id);

  res.json(user);

});



// UPDATE USER
app.put("/users/:id", async (req,res)=>{

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  );

  res.json(updatedUser);

});



// DELETE USER
app.delete("/users/:id", async (req,res)=>{

  await User.findByIdAndDelete(req.params.id);

  res.json({message:"User deleted"});

});



// TEST ROUTE
app.get("/", (req,res)=>{
  res.send("CBT Server Running");
});





// SERVER
app.listen(process.env.PORT || 5000,()=>{
  console.log("Server running on port 5000");
});