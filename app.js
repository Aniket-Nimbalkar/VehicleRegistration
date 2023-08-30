const mongoose = require("mongoose");
const { stringify } = require("querystring");
const port = process.env.PORT || 3000;
var express = require('express');
const bodyParser = require('body-parser');
const { response } = require("express");
var app = express();
const bcrypt = require("bcrypt");
const e = require("express");
const validator = require('validation')
var session = require('express-session');
// var validators = require("email-validator");

// Unique ID generator
const ID = require("nodejs-unique-numeric-id-generator");
const { clearCache } = require("ejs");

ID.generate(new Date().toJSON());

const numID = ID.generate(new Date().toJSON())

// providing location of all html files in public directory
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.render("index.html")
});

// Setting Up Directory for various pages
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

app.get('/login', function (req, res) {
  res.sendFile('login.html', { root: __dirname });
});

app.get('/finduserdetails', function (req, res) {
  res.sendFile('finduserdetails.html', { root: __dirname });
});

app.get('/contactus', function (req, res) {
  res.sendFile('contactus.html', { root: __dirname });
});
app.get('/find', function (req, res) {
  res.sendFile('display.ejs', { root: __dirname });
});
app.get('/update', function (req, res) {
  res.sendFile('updateuserdetails.html', { root: __dirname });
});

app.get('/signupacc', function (req, res) {
  res.render('signup.ejs', { numID });
});



app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})

// connection
mongoose.connect("mongodb://127.0.0.1/VehicleRegistration")

// Defining Database Registration Schema
const reg = new mongoose.Schema({
  UserId: Number,
  name: {
    type: String,
    required: true
  },
  address: String,
  city: String,
  state: String,
  MobileNo: Number,
  dateOfBirth: String,
  age: Number,
  gender: String,
  licenseNo: {
    type: String,
    required: true,
    // unique: true 
  },
  modelname: String,
  validtill: Number,
  comuse: String,
  vehitype: String,
  activeLicense: String
})

// Creating collections
//  const Registration = new mongoose.model("Registration", reg)

app.post("/submit", async (req, res) => {
  console.log(req.body.name);
  const Registration = new mongoose.model("Registration", reg)({
    UserId: req.body.myID,
    name: req.body.Name,
    address: req.body.myAddress,
    city: req.body.myCity,
    state: req.body.myState,
    MobileNo: req.body.myPhone,
    dateOfBirth: req.body.mydate,
    age: req.body.myAge,
    gender: req.body.myGender,
    licenseNo: req.body.myLicense,
    modelname: req.body.myModel,
    validtill: req.body.ValidTill,
    comuse: req.body.Commercial,
    vehitype: req.body.myType,
    activeLicense: req.body.Status
  });
  var registerd = req.body.myLicense;
  const registration = mongoose.model("registration", reg)
  const lic = await registration.findOne({ 'licenseNo': registerd })
  if (lic == null) {

    // if Registration data is not present then only registers user data
    Registration.save(function (err) {
      if (err) {
        throw err;
      } else {

        // res.sendFile(__dirname + '/public/login.html')
        res.send("Registration Successfull! Press Back");
      }
    });
  }
  else {
    res.send('Vehicle Data is Allready Registerd')
  }
});

// Vihicle Related Database Schema
const VehicleData = new mongoose.Schema({
  modelname: {
    type: String,
    unique: true,

  },
  VehicleType: String,
  FuelType: String,
  Wheels: Number,
  EngineNumber: String,
})

// Vehicle Model Database
const VehicleModelData = new mongoose.model("VehicleModelData", VehicleData)
const vehicledata = new VehicleModelData({
  modelname: 'Alto',
  VehicleType: 'Car',
  FuelType: 'Petrol',
  Wheels: 4,
  EngineNumber: 'ytw2322'
})
// vehicledata.save(function (err) {
//   if (err) {
//     throw err;
//   } else {
//      console.log('Data added Succesfully')
//   }
// });

// Insurense Database
const ins = new mongoose.Schema({
  UserID: Number,
  InsurenseId: Number,
  lisenseNo: String,
  purchasedate: String,
  startdate: String,
  enddate: String,
});

// PUC schema
const puc = new mongoose.Schema({
  UserId: Number,
  licenseNo: String,
  pucid: Number,
  TestDate: String,
  TestTime: String,
  MaxRPM: Number,
  MinRPM: Number,
  Temperature: Number
});



// login Database
// Defining Sign Up Database Schema
const log = new mongoose.Schema({
  UserId: Number,
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneno: Number,
  email: String

});

// Sign Up New User 
app.post("/signup", async (req, res) => {
  console.log(req.body.name);
  const loginDatabase = new mongoose.model("loginDatabase", log)({
    username: req.body.myUsername,
    password: req.body.Password,
    phoneno: req.body.PhoneNum,
    email: req.body.EmailID,
    UserId: req.body.myID

  });

  var user = req.body.myUsername;
  const logindatabase = mongoose.model("logindatabase", log)
  const logi = await logindatabase.findOne({ 'username': user })
  // if user is not in login database then he can sign up
  if (logi == null) {
    loginDatabase.save(async function (err) {
      if (err) {
        throw err;
      } else {
        var temp = await logindatabase.findOne({ 'username': user });
        setval = temp.UserId
        console.log(setval)
        res.render('registrations', { setval })
        // res.sendFile(__dirname + '/public/registration.html')
        // // res.redirect('login.html')
        // res.send("Sign Up Successfull! Press Back");
      }
    });
  }
  // if user is present then tells to login
  else {
    res.send('Username is Already Present Please Login!')
  }
});

// Login Code

const logindatabase = mongoose.model("logindatabase", log)
app.post('/login', async (req, res) => {
  console.log(req.body.name);
  var user = req.body.myMail;
  var pass = req.body.PassWord;

  var temp = await logindatabase.findOne({ 'username': user })
  var str = temp.UserId





  // const temp2 = await logindatabase.findOne({'password':pass})
  if (temp == null) {
    res.send('User Not Found Please Sign Up!')
  }
  else if (temp.username === user && temp.password === pass) {

    // res.send("Login Sucessfull")
    var temp = await logindatabase.findOne({ 'UserId': str });
    setval = temp.UserId
    app.get('/registrations', async function (_req, res) {
      res.render('registrations.ejs', { setval });
    });

    // Insurense Data auto
    setvalue = temp.UserId
    console.log(setvalue)
    const insid = ID.generate(new Date().toJSON())
    app.get('/insurensepage', async (_req, res) => {
    const findres = await registrations.findOne({ 'UserId': setvalue })
    if (findres == null) {
        res.send('register first')
    }
    else {
      console.log(findres.UserId)
      insdata = findres.licenseNo
      console.log(insdata)
      
        res.render('insurensepage.ejs', { setvalue, insid, insdata });
      }
      });



  




    //  res.sendFile(__dirname + '/public/index2.html')
    console.log('successfull')

    console.log(str)
    var stor = await registrations.findOne({ 'UserId': str })
    if (stor == null) {
      // res.send('Not Registered')
      // res.redirect('registration.html')
      // app.get('/insurensepage', async (_req, res) => {
      //   res.send('register first')
      // }); 
      res.render('main', { details: temp, dota: null })

    }
    else {






      // if user is not registered and modelname primary is null
      const VehicleModelDatas = mongoose.model("VehicleModelData", VehicleData)
      var demo = temp.UserId
      var veh = await registration.findOne({ UserId: demo })
      const vehicle = await VehicleModelDatas.findOne({ modelname: veh.modelname })

      const insurensedb = mongoose.model("insurensedb", ins)
      const insdata = await insurensedb.findOne({ UserID: demo })

      const pucdatabase = mongoose.model("pucdatabase", puc)
      const getpucdata = await pucdatabase.findOne({ 'UserId': demo })


      // console.log(vehicle.modelname)
      res.render('main', { details: temp, dota: stor, detail: vehicle, ins: insdata, puc: getpucdata })
    }


    // LogOut
    app.post('/logout', async (req, res) => {
      res.redirect('index.html')
    }
    )
    str3 = temp.UserId
    app.get('/updateuser', async function (_req, res) {
      var store = await registrations.findOne({ 'UserId': str3 })
      res.render('updateuser.ejs', { details: store });
    });

    // Auto Values in Delete Section
    var set = temp.UserId
    var temp7 = await logindatabase.findOne({ 'UserId': set })
    setus = temp7.UserId
    {
      app.get('/deleteData', async (_req, res) => {

        console.log(setus)
        var detedres = await registrations.findOne({ 'UserId': setus })
        var detedlog = await logindatabase.findOne({ 'UserId': setus })
        // console.log(detedres.licenseNo)
        // console.log(detedlog.UserId)
        // var login = await logindatabase.findOne({'UserId' : str} )  
        // console.log(setus)
        res.render('deleteData.ejs', { details: detedres, dota: detedlog });
      });
    }

      // PUC Data
      setvaluepuc = temp.UserId
      console.log(setvaluepuc)
      const pucid = ID.generate(new Date().toJSON())
      app.get('/getpuc', async (req, res) => {
        const findregisted = await registrations.findOne({ 'UserId': setvaluepuc })
          if (findregisted == null) { 
              res.send('register first')
          }
          else {
            console.log(findregisted.UserId)
            const pucdata = findregisted.licenseNo
            console.log(pucdata)
            res.render('getpuc.ejs', { setvaluepuc, pucdata, pucid });
        }
        });







  } else {
    // user or password doesn't match
    res.send("Invalid Credentials")
  }

});



// Update Data
const registrations = mongoose.model("Registration", reg)
app.post('/update', async (req, res) => {
  console.log(req.body.name);
  var licens = req.body.licenseno;
  // var bef = req.body.beforeName;
  var up = req.body.updateName;
  var down = req.body.upval;
  const store = await registrations.findOneAndUpdate({ 'licenseNo': licens }, { $set: { [down]: up } });
  // res.send('Update Successful')
  res.render('display', { details: store })
})

// Delete Details
app.post('/deleteDetails', async (req, res) => {
  const registrations = mongoose.model("Registration", reg)
  console.log(req.body.name);
  var que = req.body.LicenseNo;
  // var bef = req.body.beforeName;
  const del = await registrations.deleteOne({ 'licenseNo': que });
  res.send('Registration data deleted Succesfully!')
  // console.log('Data Deleted Succesfully')
  // res.send('Update Successful')

})


app.post('/deleteUser', async (req, res) => {
  const loginDatabase = mongoose.model("loginDatabase", log)
  console.log(req.body.name);
  var ques = req.body.UserID;
  const delu = await loginDatabase.deleteOne({ 'UserId': ques });
  res.send('User data deleted Succesfully!')
  res.redirect('index.html')

})

app.post("/getInsurense", async (req, res) => {
  console.log(req.body.name);
  const insurenseDb = new mongoose.model("insurenseDb", ins)({
    UserId: req.body.UserID,
    InsurenseId: req.body.InsId,
    lisenseNo: req.body.myLicense,
    purchasedate: req.body.purchasedate,
    startdate: req.body.fromdate,
    enddate: req.body.todate
  });
  const licesNo = req.body.UserID
  const insurensedb = mongoose.model("insurenseDb", ins)
  const insure = await insurensedb.findOne({ 'UserId': licesNo })
  if (insure == null) {

    // if Registration data is not present then only registers user data
    insurenseDb.save(function (err) {
      if (err) {
        throw err;
      } else {

        // res.sendFile(__dirname + '/public/login.html')
        res.send("Insurense Registration Successfull! Press Back");
      }
    });
  }
  else {
    res.send('User has is Allready Registered Insurense Data')
  }
});






// PUC Collection
app.post("/getpuc", async (req, res) => {
  console.log(req.body.name);
  const PUCDatabase = new mongoose.model("PUCDatabase", puc)({
    UserId: req.body.UserID,
    pucid: req.body.PucID,
    licenseNo: req.body.myLicense,
    TestDate: req.body.testDate,
    TestTime: req.body.testtime,
    MinRPM: req.body.minRPM,
    MaxRPM: req.body.maxRPM,
    Temperature: req.body.temperature
  });
  const Pucid = req.body.PucID
  const pucdatabase = mongoose.model("pucdatabase", puc)
  const getData = await pucdatabase.findOne({ 'pucid': Pucid })
  if (getData == null) {

    // if Registration data is not present then only registers user data
   PUCDatabase.save(function (err) {
      if (err) {
        throw err;
      } else {

        // res.sendFile(__dirname + '/public/login.html')
        res.send("PUC Registration Successfull! Press Back");
      }
    });
  }
  else {
    res.send('User has is Allready Registered PUC Data')
  }
});


app.set('view engine', 'ejs');
const registration = mongoose.model("Registration", reg)
app.post('/find', async (req, res) => {
  const pucdatabase = mongoose.model("pucdatabase", puc)
  
  const insurensedb = mongoose.model("insurenseDb", ins)
  
  const VehicleModelDatas = mongoose.model("VehicleModelData", VehicleData)

  console.log(req.body.name);
  var query = req.body.license;
  const der = await registration.findOne({ 'licenseNo': query });
  const vehi = der.modelname
  const vehicle = await VehicleModelDatas.findOne({ modelname: vehi })

  if (der == null) {
    res.send('User Data is not Registered')
  }
  else {
    //  template engine to display data in tabular format
    res.render('display', { details: der , vehicleD : vehicle})
  }
  //  displays data in single format as it is 
  //  res.send(der)
})






// Pipeline
// [
//   {
//     '$lookup': {
//       'from': 'registrations',
//       'localField': 'UserId',
//       'foreignField': 'UserId',
//       'as': 'arr'
//     }
//   }, {
//     '$project': {
//       'id': 0,
//       'UserId': 0
//     }
//   }
// ]



























