/*
SID:1155143279 Name:Lee Chi To
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';

import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
  } from 'react-router-dom';

const serverAddr = 'http://localhost:3000/';

//Used in UserRow to refresh the components
function _uuid() {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
    d += performance.now(); //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

//The main components
class App extends React.Component {
    render() {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/location/:venueId" element={<LocationDetails />} />
          </Routes>
        </BrowserRouter>
      );
    }
}

//Clients can login here
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {login: 'Invalid'};
    this.sendLoginReq = this.sendLoginReq.bind(this);
  }
    async sendLoginReq (event){
        event.preventDefault();
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;

        const data = {
            username: username, 
            password: password
        };

        await fetch(serverAddr + 'login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
          this.setState({login: data['loginStatus']});
          localStorage.setItem("username", username);
        })
        .catch(console.error);
    }

    render() {
      if(this.state.login == 'Admin')
        return <Navigate to="/admin"/>;
      else if(this.state.login == 'User')
        return <Navigate to="/user"/>;
      else if(this.state.login == 'Invalid')
        return <form id='login'>
        <input type="text" id="username" name="username" placeholder='Username'/><br/>
        <input type="password" id="password" name="password" placeholder='Password'/><br/>
        <button onClick={this.sendLoginReq}>Login</button>
        </form>;
    }
}

//Admin can CRUD events and users here (can logout)
class AdminPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {login: 'Valid'};
    this.sendLogoutReq = this.sendLogoutReq.bind(this);
  }
  //Eric
  async sendLogoutReq (event){
    event.preventDefault();
    await fetch(serverAddr + 'logout', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
      this.setState({login: data['loginStatus']});
    })
    .catch(console.error);
  }
  //Eric
  render() {
  if(this.state.login == 'Valid')
    return  <>
    <UserTable/>
    <hr></hr>
    <EventTable/>
    <button onClick={this.sendLogoutReq}>Logout</button>
    </>;
  else if(this.state.login == 'Invalid')
    return <Navigate to="/"/>;   
  }
}

// User can do ... here
function LocationTable(props) {
  const events = props.events;
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const venueMap = new Map();

    events.forEach(event => {
      const venueId = event.EventID;
      const venue = event.venue;
      const URL = "Not Setted";
      if (venueMap.has(venue)) {
        venueMap.get(venue).count++;
      } else {
        venueMap.set(venue, { venue, venueId, count: 1, URL });
      }
    });
    const sortedLocations = Array.from(venueMap.values()).sort((a, b) => b.count - a.count);
    setLocations(sortedLocations);
  }, [events]);

  return (
    React.createElement('div', null,
      React.createElement('h2', { style: { textAlign: 'center', marginBottom: '20px' } }, 'Locations Table'),
      React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { style: { padding: '8px', border: '1px solid #000' } }, 'Location'),
            React.createElement('th', { style: { padding: '8px', border: '1px solid #000' } }, 'Number of Events')
          )
        ),
        React.createElement('tbody', null,
          locations.map(location => (
            React.createElement('tr', { key: location.venueId },
              React.createElement('td', { style: { padding: '8px', border: '1px solid #000' } },
                React.createElement('a', {
                  href: location.URL,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  style: { textDecoration: 'underline', color: 'blue' }
                }, location.venue)
              ),
              React.createElement('td', { style: { padding: '8px', border: '1px solid #000' } }, location.count)
            )
          ))
        )
      )
    )
  );
}

function MapComponent(locations) {
  React.useEffect(() => {
    // Define initMap as a global function
    window.initMap = () => {
      const mapDiv = document.getElementById('map');
      const map = new window.google.maps.Map(mapDiv, {
        center: { lat: 22.344044, lng: 114.100998 },
        zoom: 11,
      });
      let locs = locations.locations

      locs.forEach(location => {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) },
          map,
          title: location.venue,
        });

        marker.addListener('click', () => {
          window.location.href = location.URL;
        });
      });
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAoMq1vLkajxFWXY-6Ya6nxP3pFYBwPDaw&callback=initMap`;
    document.body.appendChild(script);

    // Clean up: remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [locations]);

  const mapDivStyle = {
    height: '400px',
  };

  return React.createElement('div', { id: 'map', style: mapDivStyle });
}

function LocationDetails() {
  const { venueId } = this.props.match.params;
  const [locationDetails, setLocationDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/location/${venueId}`);
        const data = await response.json();
        setLocationDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocationDetails();
  }, [venueId]);

  const addToFavorites = () => {
    //
  };

  if (!locationDetails) {
    return <div>Loading...</div>;
  }

    const addComment = () => {
      const comment = {
        text: newComment,
      };

      fetch(serverAddr + 'comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update the comments state with new comment
          setComments((prevComments) => [...prevComments, data]);
          setNewComment('');
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
  };

  return (
    <div>
      <h2>Location Details</h2>
      <h3>Location Name: {locationDetails.name}</h3>
      <p>Latitude: {locationDetails.latitude}</p>
      <p>Longitude: {locationDetails.longitude}</p>

      <div id="map" style={{ height: '400px', marginBottom: '20px' }}></div>

      <h3>User Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>

      <input
        type="text"
        value={newComment}
        onChange={(event) => setNewComment(event.target.value)}
      />
      <button onClick={addComment}>Add Comment</button>
      <button onClick={addToFavorites}>Add fav location</button>
    </div>
  );
}

function FavoriteLocations() {
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  useEffect(() => {
    const fetchFavoriteLocations = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/favorites');
        const data = await response.json();
        setFavoriteLocations(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavoriteLocations();
  }, []);

  return (
    <div>
      <h2>Favorite Locations</h2>
      <ul>
        {favoriteLocations.map((location) => (
          <li key={location.id}>{location.name}</li>
        ))}
      </ul>
    </div>
  );
}

function LocationSearch(locations) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  let locs = locations.locations;

  const handleSearch = () => {
    const filteredLocations = locs.filter(
      (location, index, self) =>{
        return location.locname.includes(searchTerm);
        //index === self.findIndex(l => l.venue.toLowerCase() === location.venue.toLowerCase())
      }
    )
    //console.log(filteredLocations);
    /*const filteredLocations = locs.filter(
      (location, index, self) =>{
        console.log(location);
        console.log(index);
        //index === self.findIndex(l => l.venue.toLowerCase() === location.venue.toLowerCase())
      }
    )*/
    /*.filter(location =>
      location.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );*/
    setSearchResults(filteredLocations);
  };

  const handleChange = e => {
    setSearchResults([]); // Clear Search Results
    setSearchTerm(e.target.value);
  };

  // Create elements using React.createElement
  const mainDiv = React.createElement('div', { style: { fontFamily: 'Arial, sans-serif' } },
    React.createElement('h2', { style: { textAlign: 'center', marginBottom: '20px' } }, 'Location Search'),
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '20px' } },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search by location name...',
        value: searchTerm,
        onChange: handleChange,
        style: { padding: '8px', marginRight: '10px' }
      }),
      React.createElement('button', { onClick: handleSearch, style: { padding: '8px 12px' } }, 'Search')
    ),
    React.createElement('h3', { style: { textAlign: 'center', marginBottom: '10px' } }, 'Results'),
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
      React.createElement('thead', null,
        React.createElement('tr', { style: { backgroundColor: '#f2f2f2' } },
          React.createElement('th', { style: { padding: '8px', border: '1px solid #ddd' } }, 'Location'),
          React.createElement('th', { style: { padding: '8px', border: '1px solid #ddd' } }, 'Latitude'),
          React.createElement('th', { style: { padding: '8px', border: '1px solid #ddd' } }, 'Longitude')
        )
      ),
      React.createElement('tbody', null,
        searchResults.map(location =>
          React.createElement('tr', { key: location.id, style: { border: '1px solid #ddd' } },
            React.createElement('td', { style: { padding: '8px', border: '1px solid #ddd' } }, location.locname),
            React.createElement('td', { style: { padding: '8px', border: '1px solid #ddd' } }, location.latitude),
            React.createElement('td', { style: { padding: '8px', border: '1px solid #ddd' } }, location.longitude)
          )
        )
      )
    )
  );

  return mainDiv;
}

class UserPage extends React.Component{
  constructor(props) {
    super(props);
    //this.state = {login: 'Valid'};
    this.initEventInfo = this.initEventInfo.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.PriceSearcher = this.PriceSearcher.bind(this);
    this.state = {
      event:[],
      location:[],
      sEvent: null,
      sPrice: 0,
      username: localStorage.getItem("username"),//HKC7a
      lightDarkMode: false,
      login: 'Valid'
    };
    this.initEventInfo();
  }
  //HKC7b
  handleLogout = () => {
    this.setState({login: "Invalid"})
  };

  //HKC8-Light Dark mode Swictcher
  lDOnclick = () => {
    this.setState((prevState) => ({
      lightDarkMode: !prevState.lightDarkMode
    }));
  };

  PriceSearcher(){
    let sEvent = this.state.event.filter((ev) => {
      return ev.price <= this.state.sPrice;
    })
    this.setState({ sEvent:  sEvent});
  }
  async addLocation (locs){
    await fetch(serverAddr + 'createLoc', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(locs)
    })
    //.then((response) => console.log(response.text()))
    .catch(console.error);
  }
  async addEvent (Events){
    await fetch(serverAddr + 'createEvent', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(Events)
    })
    //.then((response) => console.log(response.text()))
    .catch(console.error);
  }
  async initEventInfo (){
    let allLoc = [];
    const LocationURL = "https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fvenues.xml&time=20231213-1417";
    await fetch(LocationURL, {
      method: 'GET',
    })
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      let locations = data.getElementsByTagName("venue");
      for(let l of locations) {
        let locname = l.getElementsByTagName('venuee')[0].childNodes[0].nodeValue;
        if(l.getElementsByTagName('latitude')[0].childNodes.length && l.getElementsByTagName('longitude')[0].childNodes.length){
          let latitude = l.getElementsByTagName('latitude')[0].childNodes[0].nodeValue;
          let longitude = l.getElementsByTagName('longitude')[0].childNodes[0].nodeValue;
          const loc = {
            id: l.id,
            locname: locname, 
            latitude: latitude, 
            longitude: longitude
          };
          allLoc.push(loc);
        }
        //this.addLocation(allLoc);
      }
    })
    .catch(console.error);
    //console.log("All locations");
    //console.log(allLoc);

    let usedLoc = [];
    let allEv;
    const EventURL = "https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fwww.lcsd.gov.hk%2Fdatagovhk%2Fevent%2Fevents.xml&time=20231213-1411";
    await fetch(EventURL, {
      method: 'GET',
    })
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      let events = data.getElementsByTagName("event");
      allEv = [];
      for(let e of events) {
        let venueID = e.getElementsByTagName('venueid')[0].childNodes[0].nodeValue;
        for(let loc of allLoc){
            if(venueID == loc.id){
              let title, description, venue, date, presenter, price, EID;
              EID = e.id;
              if(e.getElementsByTagName('titlee')[0].childNodes.length)
                title = e.getElementsByTagName('titlee')[0].childNodes[0].nodeValue;
              else
                title = "None";
              venue = loc.locname;
              if(e.getElementsByTagName('predateE')[0].childNodes.length)
                date = e.getElementsByTagName('predateE')[0].childNodes[0].nodeValue;
              else
                date = "None";
              if(e.getElementsByTagName('desce')[0].childNodes.length)
                description = e.getElementsByTagName('desce')[0].childNodes[0].nodeValue;
              else
                description = "None";
              if(e.getElementsByTagName('presenterorge')[0].childNodes.length)
                presenter = e.getElementsByTagName('presenterorge')[0].childNodes[0].nodeValue;
              else
                presenter = "None";
              if(e.getElementsByTagName('pricee')[0].childNodes.length)
                price = Math.floor(Math.random() * 200);
              else
                price = 0;
              const ev = {
                EventID: EID,
                title: title,
                venue: venue, 
                date: date, 
                description: description, 
                presenter: presenter, 
                price: price
              };
              allEv.push(ev);
              if(!usedLoc.includes(loc)){
                //console.log(loc);
                usedLoc.push(loc);
              }
              break;
            }            
        }
      } 
      //console.log("all events");

      let locs = usedLoc.slice(10, 20);
      const venues = locs.map(loc =>{ return loc.locname; });
      const usedEv = allEv.filter((event, index, self) =>{
        return venues.includes(event.venue);
      })
      this.addLocation(locs);
      usedEv.forEach(ev => this.addEvent(ev));
      this.setState({ event: usedEv });
      this.setState({ location: locs });
    })
    .catch(console.error);
  }
  
  render() {
    const { lightDarkMode } = this.state;
    const LDcontent = {
      background: lightDarkMode ? 'black' : 'white',
      color: lightDarkMode ? 'white' : 'black'
    };
    if(this.state.login == 'Valid')
      return (    
        <div style={LDcontent}>
          <div style={{ textAlign: 'right', padding: '10px' }}>
            Welcome, {this.state.username}!
            <button onClick={this.handleLogout}>Logout</button>
          </div>
          <div style={{ textAlign: 'right', padding: '10px' }}>
            <button onClick={this.lDOnclick} style={LDcontent}>
            {lightDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
          <div style={{ textAlign: 'center'}}>Price Searcher<input type="number" value={this.state.sPrice} onChange={(p) => this.setState({ sPrice: p.target.value })}/>
          <button onClick={this.PriceSearcher}>Search</button></div>
          <LocationTable events={this.state.event || sEvent}></LocationTable>
          <MapComponent locations={this.state.location}></MapComponent>
          <LocationSearch locations={this.state.location}></LocationSearch>
          <FavoriteLocations events={this.state.event}></FavoriteLocations>
            
        </div> 
      )
    else if(this.state.login == 'Invalid')
      return <Navigate to="/"/>;
  }
}
/*    

<button onload={this.initEventInfo}>Fetch</button> 
*/

//Table to list all user information
class UserTable extends React.Component {
  constructor(props) {
    super(props);
    this.getAllUser = this.getAllUser.bind(this);
    this.state = {data: this.getAllUser()};
  }
  getAllUser (){
    fetch(serverAddr + 'getUser', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
        this.setState({ data: data });
    })
    .catch(console.error);
  }

  render() {
    if(this.state.data)
      return <>
      <table>
        <thead><tr><td>No</td><td>Username</td><td>Password</td></tr></thead>
        <tbody>
          {this.state.data.map((user, index)=><UserRow key={_uuid()} id={index} username={user.username} password={user.password} refresh={this.getAllUser}/>)}
          <NewUserRow key={_uuid()} refresh={this.getAllUser}/>
        </tbody>
      </table>
      </>
    else 
      return <>Loading data from database</>
  }
}

//Row to list a single user information
class UserRow extends React.Component {
  constructor(props){
    super(props);
    this.state = {username: this.props.username, password: this.props.password};
    this.handleChange = this.handleChange.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async updateUser(){
    const data = {
      oldUsername: this.props.username,
      oldPassword: this.props.password,
      newUsername: this.state.username,
      newPassword: this.state.password
    };
    await fetch(serverAddr + 'updateUser', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    this.props.refresh();
  }

  async deleteUser(){
    const data = {
      username: this.props.username,
      password: this.props.password
    };
    await fetch(serverAddr + 'deleteUser', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    this.props.refresh();
  }

  handleChange(event){
    if(event.target.id == "username")
      this.setState({username: event.target.value})
    else if(event.target.id == "password")
      this.setState({password: event.target.value})
  };

  render() {
    return <>
    <tr>
    <td>{this.props.id + 1}</td>
    <td><input type="text" id="username" onChange={this.handleChange} value={this.state.username}/></td>
    <td><input type="text" id="password" onChange={this.handleChange} value={this.state.password}/></td>
    <td><button onClick={this.updateUser}>Update</button></td>
    <td><button onClick={this.deleteUser}>Delete</button></td>
    </tr>
    </>
  }
}

//Row as a form to create a new user
class NewUserRow extends React.Component {
  constructor(props){
    super(props);
    this.state = {username: '', password: ''};
    this.handleChange = this.handleChange.bind(this);
    this.createUser = this.createUser.bind(this);
  }

  async createUser(){
    if(this.state.username == '' || this.state.password == '')
      return;
    const data = {
      username: this.state.username,
      password: this.state.password
    };
    await fetch(serverAddr + 'createUser', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    this.props.refresh();
  }

  handleChange(event){
    if(event.target.id == "username")
      this.setState({username: event.target.value})
    else if(event.target.id == "password")
      this.setState({password: event.target.value})
  };

  render() {
    return <>
    <tr>
    <td>New</td>
    <td><input type="text" id="username" onChange={this.handleChange} placeholder='New Username'/></td>
    <td><input type="text" id="password" onChange={this.handleChange} placeholder='New Password'/></td>
    <td><button onClick={this.createUser}>Create</button></td>
    </tr>
    </>
  }
}

//Eric Start
class EventTable extends React.Component{
  constructor(props) {
    super(props);
    this.getAllEventP1 = this.getAllEventP1.bind(this);
    // this.getAllEventP2 = this.getAllEventP2.bind(this);
    this.state = {data: this.getAllEventP1()};
  }

  getAllEventP1 (){
    fetch(serverAddr + 'ev/All', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((data) => {
        // this.setState({ data: data });
        // getAllEventP2()
        fetch(serverAddr + 'ev/AllRefLoc', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          }
        })
        .then((response) => response.json())
        .then((loclist)=>{
          let newdatalist = []
          // console.log("isArray"+ Array.isArray(loclist)+"\n"+loclist)
          for(let index = 0; index<data.length;index++){
            let newdata = data[index];
            newdata.locName = loclist[index];
            newdatalist.push(newdata);
          }
          //console.log(newdatalist)
          this.setState({ data: newdatalist });
        })
    })
    .catch(console.error);
  }
  
  render() {
    if(this.state.data)
      return <>
      <table>
        <thead><tr><td>No</td><td>title</td><td>locName</td><td>date</td><td>description</td><td>presenter</td><td>price</td></tr></thead>
        <tbody>
          {this.state.data.map((event, index)=><EventRow 
            key={_uuid()} 
            id={index} 
            _id={event._id}
            title={event.title} 
            locName={event.locName}
            date={event.date}
            description={event.description}
            presenter={event.presenter} 
            price={event.price} 
            refresh={this.getAllEventP1}
          />)}
          <NewEventRow key={_uuid()} refresh={this.getAllEventP1}/>
        </tbody>
      </table>
      </>
    else 
      return <>Loading data from database</>
  }
}

class EventRow extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      _id: this.props._id,
      title: this.props.title,
      locName: this.props.locName,
      date: this.props.date,
      description: this.props.description,
      presenter: this.props.presenter,
      price: this.props.price,
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
  }

  async updateEvent(){
    const data = {
      _id: this.props._id,
      // oldtitle: this.props.title,
      // oldlocName: this.props.locName,
      // olddate: this.props.date,
      // olddescription: this.props.description,
      // oldpresenter: this.props.presenter,
      // oldprice: this.props.price,
      newtitle: this.state.title,
      newlocName: this.state.locName,
      newdate: this.state.date,
      newdescription: this.state.description,
      newpresenter: this.state.presenter,
      newprice: this.state.price      
    };
    //console.log(data);
    let respond = await fetch(serverAddr + 'ev/update', {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    if(respond.status==404)
    {
      let messagetext = await respond.text()
      //console.log(messagetext)
      window.alert(messagetext)
    }
    this.props.refresh();
  }

  async deleteEvent(){
    const data = {
      _id: this.props._id,
      // title: this.props.title,
      // locName: this.props.locName,
      // date: this.props.date,
      // description: this.props.description,
      // presenter: this.props.presenter,
      // price: this.props.price,
    };
      let respond = await fetch(serverAddr + 'ev/delete', {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    if(respond.status==404){window.alert(await respond.text())}
    this.props.refresh();
  }

  handleChange(event){
    switch(event.target.id) {
      case "title":
        this.setState({title: event.target.value})
        break;
      case "locName":
        this.setState({locName: event.target.value})
        break;
      case "date":
        this.setState({date: event.target.value})
        break;
      case "description":
        this.setState({description: event.target.value})
        break;
      case "presenter":
        this.setState({presenter: event.target.value})
        break;
      case "price":
        this.setState({price: event.target.value})
        break;
    }
  };

  render() {
    return <>
    <tr>
    <td>{this.props.id + 1}</td>
    <td><input type="text" id="title" onChange={this.handleChange} value={this.state.title}/></td>
    <td><input type="text" id="locName" onChange={this.handleChange} value={this.state.locName}/></td>
    <td><input type="text" id="date" onChange={this.handleChange} value={this.state.date}/></td>
    <td><input type="text" id="description" onChange={this.handleChange} value={this.state.description}/></td>
    <td><input type="text" id="presenter" onChange={this.handleChange} value={this.state.presenter}/></td>
    <td><input type="number" id="price" onChange={this.handleChange} value={this.state.price}/></td>
    <td><button onClick={this.updateEvent}>Update</button></td>
    <td><button onClick={this.deleteEvent}>Delete</button></td>
    </tr>
    </>
  }
}

class NewEventRow extends React.Component {
  constructor(props){
    super(props);
    this.state = {      
      title: "",
      locName: "",
      date: "",
      description: "",
      presenter: "",
      price: -1};
    this.handleChange = this.handleChange.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }

  async createEvent(){
    if(this.state.title == '' || this.state.locName == '' || this.state.date == "" ||
    this.state.description == '' || this.state.presenter == '' || this.state.price == ""
    )
      {
      // console.log("Create canceled.")
      // console.log(this.state.title  == '')
      // console.log(this.state.locName == '')
      // console.log(this.state.date.getTime() == 0)
      // console.log(this.state.description == '')
      // console.log(this.state.presenter == '')
      // console.log(this.state.price == -1)
      return;
      }

    const data = {
      newtitle: this.state.title,
      newloc: this.state.locName,
      newdate: this.state.date,
      newdescription: this.state.description,
      newpresenter: this.state.presenter,
      newprice: this.state.price      
    };
    try{
      await fetch(serverAddr + 'ev', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    }
    catch(e){
      window.alert(e)
    }
    this.props.refresh();
  }

  handleChange(event){
    // console.log(this.state.date);
    switch(event.target.id) {
      case "title":
        this.setState({title: event.target.value})
        break;
      case "locName":
        this.setState({locName: event.target.value})
        break;
      case "date":
        this.setState({date: event.target.value})
        break;
      case "description":
        this.setState({description: event.target.value})
        break;
      case "presenter":
        this.setState({presenter: event.target.value})
        break;
      case "price":
        this.setState({price: event.target.value})
        break;
    }
  };

  render() {
    return <>
    <tr>
    <td>New</td>
    <td><input type="text" id="title" onChange={this.handleChange} value={this.state.title}/></td>
    <td><input type="text" id="locName" onChange={this.handleChange} value={this.state.locName}/></td>
    <td><input type="text" id="date" onChange={this.handleChange} value={this.state.date}/></td>
    <td><input type="text" id="description" onChange={this.handleChange} value={this.state.description}/></td>
    <td><input type="text" id="presenter" onChange={this.handleChange} value={this.state.presenter}/></td>
    <td><input type="number" id="price" onChange={this.handleChange} value={this.state.price}/></td>
    <td><button onClick={this.createEvent}>Create</button></td>
    </tr>
    </>
  }
}
//Eric End

//render APP
const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);