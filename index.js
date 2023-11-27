const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const projectRoutes = express.Router(); //router
const fileRoutes = require("./routes/file-upload-routes.js");
require("dotenv/config");

const bodyParser = require("body-parser"); //for http post requests
const cors = require("cors"); //node js package to run expess server

// app.get("/",function(req,res) {
//     res.send("working");
// })


app.get("/", function(req, res) {
    App.find(function(err, todos) {
      if (err) {
        console.log(err);
      } else {
        res.json(todos);
      }
    });
  });

  app.get("/desc/:param", function(req, res) {
    var param = req.param("param");
    console.log(param+'gg');
  
    var query = {};
  
    // try {
      // var id = mongoose.mongo.ObjectID(param);
      // query = { id: id };
    // } catch {
      // query = new RegExp(value.searchterm,'i');
      // { $and: [ { $or: [{title: regex },{description: regex}] } ] } 
      query = { title: new RegExp(param, "i") };
      // query = { title: param };
    // }
  
    mongoose.model("projects").find(query, function(err, obj) {
      res.send(obj);
      console.log(obj);
    });
  });

//defining routes for api
const App = require("./models/app.model.js");
projectRoutes.route("/add").post(function(req, res) {
  let data = new App(req.body);
  data
    .save()
    .then(data => {
      res.status(200).json({ data: "Data added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding data failed");
    });
});

app.get("/posts",function(req,res) {
    res.send("iam inside posts");
})

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true}),()=>{
//     console.log("connected");
// };

 app.use("/projects", projectRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", fileRoutes.routes);

app.listen(process.env.PORT || 5200)



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

document.addEventListener('DOMContentLoaded', function () {
  const loginBtn = document.getElementById('login-btn');

  loginBtn.addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    axios.post('http://localhost:4000/api/login', { username,password })
      .then(response => {
        if (response.data.success) {
          if (response.data.userExists) {
            // Store the username in local storage
            localStorage.setItem('username', username);

            // Redirect to dashboard.html
            window.location.href = '/dashboard';
          } else {
            // Username does not exist, show an error message
            alert('Invalid username. Please try again.');
          }
        } else {
          // Handle other cases if needed
          alert('Login failed.');
        }
      })
      .catch(error => {
        console.error('Error sending login data:', error);
      });
  });
});
