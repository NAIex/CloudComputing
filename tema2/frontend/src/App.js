import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard"

import './App.css'  

export default function MyApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={
          <div>
            <Dashboard/>
          </div>
        }/>
      </Routes>
    </Router>
  );
}
