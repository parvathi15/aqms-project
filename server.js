//packages

const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require("mongoose"); //connecting to mongodb database

//environment variables in .env file
require("dotenv").config();
let User = require("./models/user.model.js");
let aqiData = require("./models/aqi.model.js");
//express server
const app = express();
const port = process.env.PORT || 4000;

//cors middleware for sending and receiving json
app.use(cors());
app.use(express.json());
// Serve static files from the 'views' directory
app.use('/views', express.static('views'));

//connection to mongodb atlas

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true  }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

//connection to mongodb atlas

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if the username exists in the database
      const existingUser = await User.findOne({ username });
        console.log(existingUser)
      if (existingUser) {
          // Check if the entered password matches the stored password (plain text)
          if (password === existingUser.password) {
              // Username and password match, login successful
              return res.status(200).json({ success: true, userExists: true });
          } else {
              // Password does not match, login failed
              return res.status(200).json({ success: false, userExists: true });
          }
      } else {
          // Username does not exist, login failed
          return res.status(200).json({ success: false, userExists: false });
      }
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/',(req,res) => {
  res.sendFile(__dirname + '/views/login.html');
})
app.get('/register',(req,res) => {
  res.sendFile(__dirname + '/views/register.html');
})
app.get('/home',(req,res) => {
  res.sendFile(__dirname + '/views/home.html');
})

app.get('/customers',(req,res) => {
  res.sendFile(__dirname + '/views/customerlist.html');
})
app.get('/info',(req,res) => {
  res.sendFile(__dirname + '/views/info.html');
})
app.get('/aqilist',(req,res) => {
  res.sendFile(__dirname + '/views/aqilist.html');
})
app.get('/admin',(req,res) => {
  res.sendFile(__dirname + '/views/adminpanel.html');
})
app.get('/dashboard',(req,res) => {
  res.sendFile(__dirname + '/views/dashboard.html');
})

// ****************
//connection to routes
const usersRouter = require("./routes/users.js");
const aqiDataRouter = require("./routes/aqi.js");
app.use("/users", usersRouter);
app.use("/aqiData", aqiDataRouter);


// ****************

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
