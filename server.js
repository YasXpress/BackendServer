import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Allow requests from your frontend
const allowedOrigins = [
  'https://frontend-client.vercel.app',
  'https://frontend-client-8ma5-9nfudbe9s-yasxpress-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

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





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
