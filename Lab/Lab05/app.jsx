const data = [
    {filename: "cuhk-2013.jpg", year:2013, remarks: "Sunset over CUHK"}, 
    {filename: "cuhk-2017.jpg", year:2017, remarks: "Bird's-eye view of CUHK"},
    {filename: "sci-2013.jpg", year:2013, remarks: "The CUHK Emblem"}, 
    {filename: "shb-2013.jpg", year:2013, remarks: "The Engineering Buildings"},
    {filename: "stream-2009.jpg", year:2009, remarks: "Nature hidden in the campus"},
    ];

class App extends React.Component{
    render(){
        return(
            <>
                <Title name={this.props.name}/>
                <Gallery />
            </>
        )
    }
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
        this.state = { selected: -1 };
        }
    
    handleClick(index, e) {
        if (this.state.selected !== index) {
            this.setState({ selected: index });
          } else {
            this.setState({ selected: -1 });
          }
    }

    render() {
        let i = this.props.i;
        return (
                <div className="card d-inline-block m-2" style={{width:this.state.selected==i ? "100%" : 200}} onClick={(e) => this.handleClick(i, e)}>
                    <img src={"images/"+data[i].filename} className="w-100" />
                    <div className="card-body">
                        <h6 className="card-title">{data[i].filename}</h6>
                        <p className="card-text">{data[i].year}</p>
                    </div>
                </div>
        );
    }
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render( <App name="CUHK pictures" />);