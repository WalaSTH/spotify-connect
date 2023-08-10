import logo from "./logo.svg";
import "./App.css";
import RoutesWrapper from "./routes/index";
import NavigationLayout from "./layouts/Main";
import { useParams, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div>
      {/* <NavigationLayout navigate={navigate} avatar={null} /> */}
      <div>
        <RoutesWrapper navigate={navigate} />
      </div>
    </div>
  );
}

export default App;
