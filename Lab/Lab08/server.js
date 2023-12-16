const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase'); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on('error', console.error.bind(console, 'Connection error:'));
// Upon opening the database successfully
db.once('open', function () {
  console.log("Connection is open...");

// creating a mongoose model
const EventSchema = mongoose.Schema({
  eventID: {
    type: Number,
    required: [true, "Name is required"],
  },
  location: {
    type: String,
    required: true,
  },
  quota: {
    type: Number,
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: () => "Please enter a valid quota",
    },
  },
});

const Event = mongoose.model("Event", EventSchema);
  
  // Creating a new event
  let newEvent = new Event({
    eventID: 123,
    location: "SHB130",
    quota: 9999,
  });

  // Saving this new event to database
  newEvent
    .save()
    .then(() => {
      console.log("a new event created successfully");
    })
    .catch((error) => {
      console.log("failed to save new event");
    });

  // Read all data
  Event.find({})
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log("failed to read");
  });  

  // Search for quota >= 500
  Event.find({ quota: { $gte: 500 } })
  .then((data) => console.log("the event with quota more than 500:", data))
  .catch((error) => console.log(error));

  // update the location if quota >= 500
  Event.findOneAndUpdate(
      { quota: { $gte:500 } },  
      { location:"Large Conference Room"}, 
      { new: true},  
    )
    .then((data) => {console.log('the updated data is:', data)})
    .catch((error) => console.log(error));

  // delete the event if quota >= 500
  Event.findOneAndDelete(
    { quota: { $gte:500 } }  
  )
  .then((data) => {console.log('the deleted data is:', data)})
  .catch((error) => console.log(error));

   // handle ALL requests
   app.all('/*', (req, res) => {
    // send this to client
    res.send('Hello World!');
  });

})

// listen to port 3000
const server = app.listen(3000);