import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import Basic from "./components/Test";
import BasicT from "./components/TestTwo";
import SignInForm from "./components/SignUpTwo";
import RoutesWrapper from "./routes/index";

function App() {
  axios.get("api/room/").then((response) => {
    console.log(response);
  });
  return (
    <div className="center">
      <RoutesWrapper />
    </div>
  );
}

export default App;
