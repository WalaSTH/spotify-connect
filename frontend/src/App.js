import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import HomePage from "./components/HomePage";
import SignUp from "./components/SignUp";
import Basic from "./components/Test";
import BasicT from "./components/TestTwo";
import SignInForm from "./components/SignUpTwo";
import RoutesWrapper from "./routes/index";
import { useParams, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div className="center">
      <RoutesWrapper navigate={navigate} />
    </div>
  );
}

export default App;
