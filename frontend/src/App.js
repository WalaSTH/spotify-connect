import logo from "./logo.svg";
import "./App.css";
import RoutesWrapper from "./routes/index";
import NavigationLayout from "./layouts/Main";
import { useParams, useNavigate } from "react-router-dom";
import MainApp from "./components/MainApp";

function App() {
  const navigate = useNavigate();
  return <div><MainApp /></div>;
  
}

export default App;
