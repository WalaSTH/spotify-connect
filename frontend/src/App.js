import logo from "./logo.svg";
import "./App.css";
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
