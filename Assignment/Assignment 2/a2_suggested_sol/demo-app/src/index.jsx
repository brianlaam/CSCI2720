import ReactDOM from 'react-dom/client'
import React from 'react';
// import { useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { useMatch, useParams, useLocation } from 'react-router-dom';

const data = [
    {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"}, 
    {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
    {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"}, 
    {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
    {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
];

class App extends React.Component{
  render(){
    return (
      <BrowserRouter>
        <div>
          <Navigation />

          <hr />

          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/slideshow" element={<Slideshow />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

class Home extends React.Component{
  render() {
    return <h2>Home</h2>;
  };
}
class NoMatch extends React.Component{
  render() {
    return <h2>404 Not Found</h2>;
  }
}
class Navigation extends React.Component{
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/gallery">Images</Link>
          </li>
          <li>
            <Link to="/slideshow">Slideshow</Link>
          </li>
        </ul>
      </div>
    );
  }
};
// class Title extends React.Component {
//     render() {
//         return (
//         <header className="bg-warning">
//             <h1 className="display-4 text-center">{this.props.name}</h1>
//         </header>
//         );
//     }
// }
class Gallery extends React.Component {
    render() {return data.map((file,index) => <FileCard i={index} key={index}/>)};
}
class FileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: -1 };
    }

    handleMouseEnter(index, e) {
        this.setState({ selected: index });
    }

    handleMouseLeave() {
        this.setState({ selected: -1 });
    }

    render() {
        let i = this.props.i;
        let isSelected = this.state.selected === i;

        return (
            <div
                className="card d-inline-block m-2"
                // style={{ width: 200 }}
                style={{ width: isSelected ? 400 : 200 }}
                onMouseEnter={(e) => this.handleMouseEnter(i, e)}
                onMouseLeave={() => this.handleMouseLeave()}
            >
                <img
                    src={"images/" + data[i].filename}
                    className="w-100"
                />
                <div className="card-body">
                    <h6 className="card-title">{data[i].filename}</h6>
                    <p className="card-text">{data[i].year}</p>
                </div>
            </div>
        );
    }
}
class Slideshow extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentImageID: 0,
        currentInterval: 1500,
        isSlideshowRunning: false,
        images: [
          {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"}, 
          {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
          {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"}, 
          {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
          {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
        ],
      };
      this.timer = null;
    }
  
    componentDidMount() {
      this.startSlideshow();
    }
  
    componentWillUnmount() {
      this.stopSlideshow();
    }
  
    startSlideshow = () => {
      if (!this.state.isSlideshowRunning) {
        this.setState({ isSlideshowRunning: true });
        this.timer = setInterval(this.nextImage, this.state.currentInterval);
      }
    };
  
    stopSlideshow = () => {
      if (this.state.isSlideshowRunning) {
        this.setState({ isSlideshowRunning: false });
        clearInterval(this.timer);
      }
    };
  
    slowerInterval = () => {
      if (this.state.currentInterval + 200 >= 200) {
        this.setState((prevState) => ({
          currentInterval: prevState.currentInterval + 200,
        }));
        this.stopSlideshow();
        this.startSlideshow();
      }
    };
  
    fasterInterval = () => {
      if (this.state.currentInterval - 200 >= 200) {
        this.setState((prevState) => ({
          currentInterval: prevState.currentInterval - 200,
        }));
        this.stopSlideshow();
        this.startSlideshow();
      }
    };
  
    shuffleImages = () => {
      const shuffledImages = [...this.state.images];
      for (let i = shuffledImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImages[i], shuffledImages[j]] = [
          shuffledImages[j],
          shuffledImages[i],
        ];
        }
        this.setState({ images: shuffledImages });
    };
  
    nextImage = () => {
        this.setState((prevState) => ({
        currentImageID:
            (prevState.currentImageID + 1) % prevState.images.length,
        }));
    };
  
    render() {
        const { currentImageID, currentInterval, images } = this.state;
        const currentImage = images[currentImageID];

        return (
            <div>
            <div>
                <button onClick={this.startSlideshow}>Start slideshow</button>
                <button onClick={this.stopSlideshow}>Stop slideshow</button>
                <button onClick={this.slowerInterval}>Slower</button>
                <button onClick={this.fasterInterval}>Faster</button>
                <button onClick={this.shuffleImages}>Shuffle</button>
            </div>
            <div>
                <img src={"images/" + currentImage.filename} alt={currentImage.remarks} />
                <p>{currentImage.filename}</p>
            </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render( <App name="CUHK pictures" />);