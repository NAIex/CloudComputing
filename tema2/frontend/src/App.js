import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard"

import './App.css'  
import Managing from "./Managing";

export default function MyApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={
          <div>
            <Managing/>
          </div>
        }/>
      </Routes>
    </Router>
  );
}
