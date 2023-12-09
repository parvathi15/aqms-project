const router = require("express").Router(); //express router
let aqiData = require("../models/aqi.model.js");

router.route("/").get((req, res) => {
  // end point of http requests at the end of "/"
  aqiData.find() //list of all users from mongodb database
    .then(users => res.json(users)) //users in json format
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const city = req.body.city;
  const aqi = Number(req.body.aqi);
  const status = req.body.status;
  const pm25 = Number(req.body.pm25);
  const newaqiData = new aqiData({ city,aqi,status,pm25});

  //new user saved in database
  newaqiData
    .save()
    .then(() => res.json("New data added!"))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route('/update/:id').put((req, res) => {

    aqiData.findById(req.params.id)
 .then(aqiData => {
    aqiData.city = req.body.city,
    aqiData.aqi = req.body.aqi,
    aqiData.status =req.body.status,
    aqiData.pm25 =req.body.pm25
    aqiData.save()
      .then(() => res.json('Data Updated!'))
      .catch(err => res.status(400).json('Error: ' + err));
})
.catch(err => res.status(400).json('Error: ' + err));
});




router.route("/:id").get((req, res) => {
    aqiData.findById(req.params.id)
    .then(aqiData => res.json(aqiData))
    .catch(err => res.status(400).json("Error: " + err));
});
router.route("/:id").delete((req, res) => {
    aqiData.findByIdAndDelete(req.params.id)
    .then(() => res.json("Data deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;