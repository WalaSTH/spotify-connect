import logo from './logo.svg';
import './App.css';
import axios from "axios";
import HomePage from './components/HomePage';

function App() {
  axios.get("api/room/").then((response)=> {
    console.log(response);
  })
  return (
    <div className="center">
{/*       <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Welcomeeeee
        </a>
      </header> */}
      <HomePage></HomePage>
    </div>
  );
}

export default App;
