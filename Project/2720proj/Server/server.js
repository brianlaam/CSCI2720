/*
SID:1155143279 Name:Lee Chi To
*/
//Import required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { error } = require('console');
const cors = require('cors');

//Connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/2720project');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
//Declare variables
const app = express();
const port = process.env.PORT || 3000;
const adminUsername = 'Admin';
const adminPassword = 'Admin';
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

//use some functions
app.use(express.static(DIST_DIR));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//Define user schema and model
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  comments: [
    {
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
      },
      text: String,
    },
  ],
});
const User = mongoose.model("User", UserSchema);


//Define event schema and model
const EventSchema = mongoose.Schema({
  title:{
    type: String,
    required: [true, "title is required"]
  },
  _location: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Location',//may change
    required: true,
  },
  date:{
    type: String,
    required: true,
  },
  description:{
    type: String,
  },
  presenter:{
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
const Event = mongoose.model("EventProject",EventSchema);

//Define location schema and model
const LocationSchema = mongoose.Schema({
  locname: {
    type: String,
    required: [true, "locname is required"]
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: String,
    },
  ],
})
const Location = mongoose.model("LocationProject", LocationSchema);  

app.get('/location/:venueId', (req, res) => {
  const locationId = req.params.venueId;

  Location.findById(locationId)
    .populate('comments.user', 'username') // for populate user details in comments
    .then((location) => {
      res.json(location);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Failed to retrieve location' });
    });
});

//update comment section
app.post('/comment', (req, res) => {
  console.log(req.body);
  const comment = req.body['comment'];
  
  let newComment = new Comment({
    comment: comment
  });

  newComment.save()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error('Error adding comment:', error);
      res.status(500).send('Error adding comment');
    });
});

//Check if there exist admin account, initialize it if not yet
User.find({username: adminUsername, password: adminPassword})
.then((data) => {
  if(!data.length){
    let initAdmin = new User({
      username: adminUsername,
      password: adminPassword,
    });

    initAdmin.save()
    .then(() => {
      console.log("Initialized admin account in mongoDB.");
    })
    .catch((error) => {
      console.log("Failed to initialize admin account");
    });
  }
})
.catch((err) => {
  console.log("Failed in finding admin account");
});

//Check if requested user is in DB, login is valid if yes, else invalid
app.post('/login', (req, res) => {
  let loginUsername = req.body['username'];
  let loginPassword = req.body['password'];
  let loginStatus = "Invalid";
  console.log(`loginUsername: ${loginUsername} loginPassword: ${loginPassword}`);
  User.findOne({username: loginUsername, password: loginPassword})
  .then((data) => {
    if(data){
      if(loginUsername == adminUsername)
        loginStatus = "Admin";
      else
        loginStatus = "User";
    }
    res.json({loginStatus: loginStatus});
  })
  .catch((err) => {
    console.log("Failed in finding user account");
  });
});

//Return all username and password in DB
app.post('/getUser', (req, res) => {
  User.find({})
  .select('-_id -__v')
  .then((data) => {
    res.setHeader('content-type', 'application/json');
    res.send(data);
  })
  .catch((err) => {
    console.log("Failed in finding user account");
  });
});

//Update username and password
app.post('/updateUser', (req, res) => {
  console.log(req.body);
  oldUsername = req.body['oldUsername'];
  oldPassword = req.body['oldPassword'];
  newUsername = req.body['newUsername'];
  newPassword = req.body['newPassword'];
  User.findOneAndUpdate({username: oldUsername, password: oldPassword}, {username: newUsername, password: newPassword})
  .then((data) => {
    res.send('Updated');
  })
  .catch((err) => {
    console.log("Failed in updating user account");
  });
});

//Delete username and password
app.post('/deleteUser', (req, res) => {
  console.log(req.body);
  username = req.body['username'];
  password = req.body['password'];
  User.findOneAndDelete({username: username, password: password})
  .then((data) => {
    res.send('Deleted');
  })
  .catch((err) => {
    console.log("Failed in deleting user account");
  });
});

//Create a user with specified username and password
app.post('/createUser', (req, res) => {
  console.log(req.body);
  username = req.body['username'];
  password = req.body['password'];
  let newUser = new User({
    username: username,
    password: password
  })
  newUser.save()
  .then((data) => {
    res.send('Created');
  })

});

//Eric Start
app.post('/logout', (req, res) => {
  loginStatus = "Invalid";
  console.log("User has logged out.")
  res.json({loginStatus : loginStatus})
 });

app.post('/ev/All',(req,res)=>{
  console.log('/ev/All detected');
  Event.find({})
    .then((data)=>{
          res.set('Content-Type', 'application/json');
          res.send(data);
    })
    .catch((error)=>{
      console.log(error);
    })
})

app.post('/ev/AllRefLoc',(req,res)=>{
  console.log('/ev/AllRefLoc detected');
  Event.find({})
  .then((data)=>{
    const LocationArray = [];
    async function loopLocation(data,LocationArray){
      for(let curEvent=0;curEvent<data.length;curEvent++){
        locdata = await Location.findOne({_id : {$eq : data[curEvent]._location}})
        LocationArray.push(locdata.locname)
      }
      return LocationArray;
    }
    loopLocation(data,LocationArray).then(
      (value)=>{
        res.set('Content-Type', 'application/json');
        res.send(value);
      }
    )
  })
  .catch((error)=>{
    console.log(error)
  })
})

app.post('/ev',(req,res)=>{ //create
  let newtitle = req.body.newtitle;
  let newdate = req.body.newdate;
  let newloc = req.body.newloc;
  let newdescription = req.body.newdescription;
  let newpresenter = req.body.newpresenter;
  let newprice = req.body.newprice;

  console.log("/ev POST detected");
  console.log(newtitle+newdate+newloc+newdescription+newpresenter+newprice)
  res.set('Content-Type', 'text/plain');

  //Creating a new event
  Location.findOne({locname:{ $eq: newloc }})
    .then((locdata)=>{
      if (locdata==null) 
      throw 404;
      let newEvent = new Event({
        title: newtitle,
        date:newdate,
        _location: locdata._id,
        description: newdescription,
        presenter:newpresenter,
        price:newprice,
      });  
      //Saving this new event to database
      newEvent.save()
        .then(() => {
          console.log("a new event created successfully");
          res.status(201).send("Event added sucessfully!")
        })
        .catch((error) => {
          console.log("failed to save new event");
        });
        
      
      

    })
    .catch((error)=>{
      console.log(error);
      if (error==404) res.status(error).send("Error " + error + ":\nloc not found!")
    })
});

app.put('/ev/update',(req,res)=>{ //update
  let _id = req.body._id;
  let title = req.body.newtitle;
  let date = req.body.newdate;
  let loc = req.body.newlocName;
  let description = req.body.newdescription;
  let presenter = req.body.newpresenter;
  let price = req.body.newprice;
  console.log("/ev/update detected")
// find eventID if locID is found
Location.findOne({locname:{ $eq : loc}})
  .then((locdata)=>{
    // update the detail if eventID is found
    console.log(locdata);
    if(locdata == null) throw "Location not Found";
    Event.findOneAndUpdate(
      { _id: { $eq:_id } },  
      { 
        title: title,
        date:date,
        _location: locdata._id,
        description: description,
        presenter:presenter,
        price:price,
      }, 
      { new: true},  
    )
    .then((data) => {
      console.log('the updated data is:'+ data);
      res.set('Content-Type', 'text/plain');
      res.send('the updated data is:'+ data);
    })
    .catch((error) => {
      console.log("316"+error)
      console.log(error == "Event not Found")
      if (error == "Event not Found"){
        res.set('Content-Type', 'text/plain');
        res.status(404).send("Event not Found!");
      }
    });
  })
  .catch((error) => {
    console.log("325"+error)
    if (error == "Location not Found"){
      res.set('Content-Type', 'text/plain');
      res.status(404).send("Location not Found!");
    }
  });
})

app.delete("/ev/delete",(req,res)=>{ //delete
    
  console.log("DELETE detected");    
  res.set('Content-Type', 'text/plain');    
  let _id = req.body._id;
  console.log("_id="+_id);
  // delete the event if event is found
  Event.findOneAndDelete(
    { _id: { $eq : _id } }  
  )
  .then((data) => {
    if(data==null) throw 404;
    let message = 'the deleted data is:'+ data
    console.log(message);
    res.sendStatus(204);
  })
  .catch((error) => {
    console.log(error)
    res.status(404).send('Error:'+ error);
  });
});
//Eric End

//create location in database
app.post('/createLoc', (req, res) => {
  res.set('Content-Type', 'text/plain');
  //console.log(req.body);
  let locs = req.body;
  for(let loc of locs){
    let locname = loc['locname'];
    let latitude = loc['latitude'];
    let longitude = loc['longitude'];
    Location.findOne(
      { locname: { $eq : locname } }  
    )
    .then((data) => {
      if(data==null){
        let newLoc = new Location({
          locname: locname,
          latitude: latitude, 
          longitude: longitude
        })
        newLoc.save()
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send('Error:'+ error);
    });
  }
  res.send('Created new location');
});

//create event in database
app.post('/createEvent', (req, res) => {
  res.set('Content-Type', 'text/plain');
  //console.log(req.body);
  //let events = req.body;
  let ev = req.body;
  //for(let ev of events){
    let title = ev['title'];
    let venue = ev['venue'];
    let date = ev['date'];
    let description = ev['description'];
    let presenter = ev['presenter'];
    let price = ev['price'];
    Location.findOne(
      { locname: { $eq : venue } }  
    )
    .then((data) => {
      if(data!=null){
        Event.findOne(
          { title: { $eq : title }, date: { $eq : date } }  
        )
        .then((ev) => {
          if(ev==null){
            let newEv = new Event({
              title: title,
              _location: data._id, 
              date: date, 
              description: description, 
              presenter: presenter, 
              price: price
            })
            newEv.save()
          }
        })
        .catch((error) => {
          console.log(error)
        });
      }else{
        console.log("Can't find venue for " + title);
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(404).send('Error:'+ error);
    });
  //}
  res.send('Created new event');
});

//Send index.html to client
app.get('/', (req, res) => {
 res.sendFile(HTML_FILE);
});

//Response invalid access to admin/user page
app.get('/admin', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.send("Please login from http://localhost:3000");
});

app.get('/user', (req, res) => {
  res.setHeader('content-type', 'text/html');
  res.send("Please login from http://localhost:3000");
});
 
//Start server on port #port
app.listen(port, function () {
 console.log('App listening on port: ' + port);
});