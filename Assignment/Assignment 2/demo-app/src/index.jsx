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
Date : 14-11-2023 */

import ReactDOM from "react-dom/client";
import React from 'react';
import {BrowserRouter, Routes, Route, Link,} from 'react-router-dom';

const data = [
  {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"}, 
  {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
  {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"}, 
  {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
  {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
];

class Home extends React.Component {
  render() {
    return (
      <div className="text-center">
        <h2>Tree diagram of react component</h2>
        <img src="React Tree.png" />
      </div>
    );
  }
}

class Slideshow extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: data,
      currentImageID: 0,
      currentInterval: 1500,
    }
  }
  
  play() {
    this.intervalID = setInterval(() => {
      if (this.state.currentImageID < this.state.data.length - 1) {
          this.setState({ currentImageID: this.state.currentImageID + 1 });
      }
      else {
          this.setState({ currentImageID: 0 });
      }
      console.log(this.state.currentInterval)       // Showing Current Interval
      console.log(this.state.currentImageID)        // Showing Current Image ID
    }, this.state.currentInterval)
  }

  stop() {
    clearInterval(this.intervalID)
  }

  slower() {
    this.setState({ currentInterval: this.state.currentInterval + 200 }, () => {
      this.stop();
      this.play();
    });
  }
  
  faster() {
    if (this.state.currentInterval > 200) {
      if (this.state.currentInterval - 200 <= 200){
        this.setState({ currentInterval: 200 }, () => {
          this.stop();
          this.play();
        });
      }
      else {
        this.setState({ currentInterval: this.state.currentInterval - 200 }, () => {
          this.stop();
          this.play();
        }); 
      }
    }
  }
  
  shuffle = () => {
    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    console.log(shuffledData);
    
    this.setState({
      data: shuffledData,
      currentImageID: 0,
    });
    this.stop()
    this.play()
  };
  
  render() {
    let i = this.state.currentImageID;
    return (
      <div className="text-center">
        <h2>Slideshow</h2>
        <br />
        <div>
          <img src={"images/" + this.state.data[i].filename} style={{ width: 200 }} />

          <div className="card-body">
            <h6 className="card-title">{this.state.data[i].filename}</h6>
            <p className="card-text">{this.state.data[i].year}</p>
          </div>
        
          <button type="button" className="mx-2 btn btn-danger" onClick={(e) => { this.play() }}>Start slideshow</button>
          <button type="button" className="mx-2 btn btn-info" onClick={(e) => { this.stop() }}>Stop slideshow</button>
          <button type="button" className="mx-2 btn btn-warning" onClick={(e) => { this.slower() }}>Slower</button>
          <button type="button" className="mx-2 btn btn-success" onClick={(e) => { this.faster() }}>Faster</button>
          <button type="button" className="mx-2 btn btn-secondary" onClick={(e) => { this.shuffle() }}>Shuffle</button>
        </div>
      </div>
    )
  }
}

class NoMatch extends React.Component {
  render() {
    return <h2>URL Not Found</h2>;
  };
}

class Title extends React.Component {
  render() {
      return (
          <header className="bg-warning">
              <h1 className="display-4 text-center">{this.props.name}</h1>
          </header>
      );
  }
}

class Gallery extends React.Component {
  render() {
      return (
          <main className="container">
              {data.map((file,index) => <FileCard i={index} key={index}/>)}
          </main>
      );
  }
}

class FileCard extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = { isHovered: false };
  }
    
  handleMouseEnter() {
    this.setState({ isHovered: true });
  }
    
  handleMouseLeave() {
    this.setState({ isHovered: false });
  }

  render() {
      let i = this.props.i;
      return (
        <div className="card d-inline-block m-2" style={{width: this.state.isHovered ? 400 : 200}} 
        onMouseEnter={() => this.handleMouseEnter()} onMouseLeave={() => this.handleMouseLeave()}>
                  <img src={"images/"+data[i].filename} className="w-100" style={{ width: 200, height: 'auto' }}/>
                  <div className="card-body">
                      <h6 className="card-title">{data[i].filename}</h6>
                      <p className="card-text">{data[i].year}</p>
                  </div>
              </div>
      );
  }
}

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Title name={this.props.name}/>
          <div className="text-white bg-info">
            <ul>
              <li> <Link to="/" className="text-white">Home</Link> </li>
              <li> <Link to="/gallery" className="text-white">Images</Link> </li>
              <li> <Link to="/slideshow" className="text-white">Slideshow</Link> </li>
            </ul>
          </div>
        </div>
        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/slideshow" element={<Slideshow />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>

      </BrowserRouter>
    );
  }
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(
    <App name="CUHK pictures"/>
);
