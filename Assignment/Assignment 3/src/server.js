/* I declare that the lab work here submitted is original
except for source material explicitly acknowledged,
and that the same or closely related material has not been
previously submitted for another course.
I also acknowledge that I am aware of University policy and
regulations on honesty in academic work, and of the disciplinary
guidelines and procedures applicable to breaches of such
policy and regulations, as contained in the website.
University Guideline on Academic Honesty:
https://www.cuhk.edu.hk/policy/academichonesty/
Student Name : Lam Hoi Chun
Student ID : 1155192755
Class/Section : CSCI2720
Date : 14-12-2023
*/

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

// Problem 1
const EventSchema = new mongoose.Schema({
    eventId: {
        type: Number, 
        required: true,
        unique: true
    },
    name: { type: String, required: true },
    loc: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    quota: { type: Number }
});

const LocSchema = new mongoose.Schema({
    locId: {
        type: Number, 
        required: true,
        unique: true
    },
    name: { type: String, required: true },
    quota: { type: Number }
});

const Event = mongoose.model('Event', EventSchema);
const Location = mongoose.model('Location', LocSchema);

// Problem 2 //
app.get('/ev/:eventID', (req, res) => {
  const eventID = parseInt(req.params.eventID);
  
  Event.findOne({ eventId: eventID })
    .populate('loc')
    .then(event => {
      if (!event) {
        res.status(404).send('Event not found');
      } else {
        const { eventId, name, loc, quota } = event;
        const responseText = `
          {
            "eventId": ${eventId},
            "name": "${name}",
            "loc": {
              "locId": ${loc ? loc.locId : null},
              "name": "${loc ? loc.name : null}"
            },
            "quota": ${quota}
          }
        `;
        res.type('text/plain').send(responseText);
      }
    })
    .catch(error => {
      console.error('Error finding event:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Problem 3 /
app.post('/ev', (req, res) => {
  const event = req.params.eventID;
  const location = req.params.locID;
  const user = req.body.loginID;

  const message = `
  <html>
    <head>
      <title>Event information</title>
    </head>
    <body>
      <p>Event ID: ${event}</p>
      <p>Location: ${location}</p>
      <p>Login ID: ${user}</p>
    </body>
  </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(message);
});

// Problem 4 /
app.delete('/ev/:eventId', (req, res) => {
  var query = Event.findOne({ eventId: req.params['eventId'] });
  query.exec().then(ev_del => {
    if (ev_del == null) {
        res.contentType('text/plain')
        res.status(404).send("Event Not Found");
    } else {
        Event.deleteOne({ _id: ev_del._id },).then(function () {
            res.status(204).send("204 No Content")
        }, error => {
            res.contentType('text/plain')
            res.send(error);
        })
    }
  }, err => {
      res.contentType('text/plain')
      res.send(err);
  })
})

// Problem 5 Q1: Show all ev
app.get('/ev', (req, res) => {
  var query = Event.find();
  query.select('-_id eventId name loc quota').populate('loc', '-_id locId name');
  query.exec().then(results => {
      if (results == null) {
          res.send("Event Not Found");
      } else {
          res.contentType('text/plain')
          var event = JSON.stringify(results, null, "\t")
          res.send(event)
      }
  }, err => {
      res.contentType('text/plain')
      res.send(err);
  })
});

// Problem 5 Q2: Show 1 loc
app.get('/lo/:locId', (req, res) => {
  var query = Location.findOne({ locId: req.params['locId'] });
  query.select('-_id locId name quota');
  query.exec().then(results => {
    if (results == null) {
      res.contentType('text/plain')
      res.status(404).send("Location Not Found");
    }
    else {
      res.contentType('text/plain')
      var event = JSON.stringify(results, null, "\t")
      res.send(event)
    }
  }, error => {
    res.contentType('text/plain')
    res.send(error)
  })
});

// Problem 5 Q3: Show all loc
app.get('/lo', (req, res) => {
  Location.find()
    .select('-_id locId name quota')
    .exec()
    .then(locations => {
      if (locations.length === 0) {
        res.status(404).send('Locations Not Found');
      } else {
        res.contentType('application/json');
        res.send(JSON.stringify(locations));
      }
    })
    .catch(error => {
      console.error('Error fetching locations:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Problem 5 Q4: Filter By Quota /
app.get('/ev', (req, res) => {
  const quotaQuery = parseInt(req.query.q) || 0;

  Location.find({ quota: { $gte: quotaQuery } })
    .select('-_id eventId name loc quota')
    .populate('loc', '-_id locId name')
    .exec()
    .then(events => {
      res.contentType('application/json');
      res.send(JSON.stringify(events));
    })
    .catch(error => {
      console.error('Error fetching events:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Problem 6
app.put('/ev/:eventId', (req, res) => {
  var query = Location.findOne({ locId: req.body['loc'] }).select('_id quota locId name')
  query.exec().then(loc => {
      if (loc == null) {
        res.contentType('text/plain')
        res.status(404).send("Location Not Found.\n404 Not Found\n");
      }
      else {
          Event.findOneAndUpdate({ eventId: req.body['eid'] }, {
            name: req.body['name'],
            loc: loc._id,
            quota: req.body['quota']
          }).exec().then(re => {
            if (re == null) {
              res.contentType('text/plain')
              res.status(404).send("Event Not Found.\n404 Not Found\n");
            } else {
              res.contentType('text/plain')
              var results = {
                eventId: Number(req.body['eid']),
                name: req.body['name'],
                loc: { locId: loc.locId, name: loc.name },
                quota: Number(req.body['quota'])
              }
              var event = JSON.stringify(results, null, "\t")
              res.send(event)
            }
          }, err => {
              res.contentType('text/plain')
              res.send(err)
          })
      }
  }, error => {
    res.contentType('text/plain')
    res.send(error)
  })
})

function update(form) {
  var eid = document.querySelector("#eventid").value
  var name = document.querySelector("#neweventname").value
  var locat = document.querySelector("#neweventloc").value
  var quota = document.querySelector("#neweventquota").value
  if (eid.length < 1) {
      document.querySelector("#eventId").classList.add("is-invalid")
  }
  else if (name.length<1||locat.length<1||quota.length<1) {
      alert("Some information is missing")
  }
  else {
      var link = "http://localhost:3000/ev/" + eid
      form.action = link + "?_method=PUT"
  }
}

const server = app.listen(3000);