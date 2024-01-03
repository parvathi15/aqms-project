const router = require("express").Router(); //express router
let User = require("../models/user.model.js");

router.route("/").get((req, res) => {
  // end point of http requests at the end of "/"
  User.find() //list of all users from mongodb database
    .then(users => res.json(users)) //users in json format
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const newUser = new User({ username,password,email });

  //new user saved in database
  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route('/update/:id').put((req, res) => {
console.log(req);
  User.findById(req.params.id)
 .then(user => {
  user.username = req.body.username,
  user.password = req.body.password,
  user.email =req.body.email
  user.save()
      .then(() => res.json('user Updated!'))
      .catch(err => res.status(400).json('Error: ' + err));
})
.catch(err => res.status(400).json('Error: ' + err));
});


router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json("Error: " + err));
});
router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
