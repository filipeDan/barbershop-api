import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import VerifyEmail from "./components/Auth/VerifyEmail";
import './styles/global.css'; // 👈 Aqui está a importação

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/verify-email/:token" component={VerifyEmail} />
      </Switch>
    </Router>
  );
}

export default App;
