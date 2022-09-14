const express = require('express');

const router = express.Router()

const Model = require('../model/model');

const Result = require('../model/result');

const Register = require('../model/register');

const bcrypt = require("bcryptjs");

const jwt = require('jsonwebtoken');

const auth = require("../middleware/auth");

module.exports = router;

// Register

router.post("/register", async (req, res) => {

  // Our register logic starts here
  try {
    
    const { name, email, password } = req.body;

    // check if register already exist
    // Validate if register exist in our database
    const oldUser = await Register.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create register in our database
    const register = new Register({
        name: name,
        email: email.toLowerCase(),
        password: encryptedPassword
    })

    // Create token
    const token = jwt.sign(
        { register: register._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
    );

    // save register token
    register.token = token;

    console.log('register :',register);

    const dataToSave = await register.save();

    // return new register
    res.status(200).json(dataToSave);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Login

router.post("/login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await Register.findOne({ email });
console.log('user :',user);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

//Add Users
router.post('/add', auth, async (req, res) => {
    const data = new Model({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Add Marks
router.post('/addmark', auth, async (req, res) => {
    const data = new Result({
        subject: req.body.subject,
        marks: req.body.marks,
        grade: req.body.grade,
        userid_fk: req.body.userid_fk
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//View All
router.get('/view', auth, async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID
router.get('/getOne/:id', auth, async (req, res) => {
    try{
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID
router.patch('/update/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID 
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})