const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables from .env file
let User = require("./models/user.model.js");
let aqiData = require("./models/aqi.model.js");

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB using Atlas URI from environment variables
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);


// Routes
app.get("/", (req, res) => {
  res.render("login");
});

  app.get("/register", (req, res) => {
    res.render("register", { err: req.session.error });
  });

 

  app.get('/info', (req, res) => {
    // Check if the user is authenticated (session exists)
    if (req.session.username) {
      const username = req.session.username;
      res.render('info', { username });
    } else {
      res.redirect('/login');
    }
  });


  app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        req.session.error = "Email already exists";
        return res.redirect("/register");
      }
  
      const newUser = new User({
        username,
        email,
        password,
      });
  
      await newUser.save();
      req.session.isAuth = true;
      req.session.username = newUser.username;
      res.redirect("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      req.session.error = "Error registering user";
      res.redirect("/register");
    }
  });

app.get("/login", (req, res) => {
  res.render("login", { err: req.session.error });
});



app.post("/login", async (req, res) => {
  const { username ,password} = req.body;


  try {
    const existingUser = await User.findOne({ username });


    if (existingUser && existingUser.username === "admin") {
  
      req.session.isAuth = true;
      req.session.username = ""; 
  
      return res.redirect("/adminpanel");
    }
    if (!existingUser) {
      req.session.error = "Enter Username"; 
      return res.redirect("/login");
    }

    if (existingUser.password !== password) {
      req.session.error = "Password Incorrect";
      return res.redirect("/login");
    }

    // Set session variables for authentication
    req.session.isAuth = true;
    req.session.username = existingUser.username;


    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    req.session.error = "Error during login";
    res.redirect("/login");
  }
});





app.get("/dashboard", (req, res) => {
  if (req.session.isAuth) {
    res.render("dashboard", { username: req.session.username });
  } else {
    req.session.error = "You have to login first";
    res.redirect("/login");
  }
});





app.get("/adminpanel", (req, res) => {
  console.log("req.session.isAuth:", req.session.isAuth);
  if (req.session.isAuth && req.session.username === "admin") {
    res.render("adminpanel", { username: req.session.username });
  } else {
    req.session.error = "You have to login as admin";
    res.redirect("/login");
  }
});

app.get("/customerlist", (req, res) => {
  console.log("req.session.isAuth:", req.session.isAuth);
  if (req.session.isAuth && req.session.username === "admin") {
    res.render("customerlist", { username: req.session.username });
  } else {
    req.session.error = "You have to login as admin";
    res.redirect("/login");
  }
});


app.get("/aqilist", (req, res) => {

  // Check if the user is authenticated and has the username "admin"
  if (req.session.isAuth && req.session.username === "admin") {
    res.render("aqilist", { username: req.session.username });
  } else {
    req.session.error = "You have to login as admin";
    res.redirect("/login");
  }
});



// Logout
app.post('/logout', (req, res) => {
  console.log("sdfsdfj");
  console.log('Session ID before logout:', req.sessionID);
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout failed:', err);
      res.status(500).json({ error: 'Logout failed' });
    } else {
      req.session = null;
      console.log('Session ID after logout:', req.sessionID);
      res.json({ success: true });
    }
  });
});




//connection to routes
const usersRouter = require("./routes/users.js");
const aqiDataRouter = require("./routes/aqi.js");
app.use("/users", usersRouter);
app.use("/aqiData", aqiDataRouter);

app.listen(port, () => console.log(`Server running on port: http://localhost:${port}`));