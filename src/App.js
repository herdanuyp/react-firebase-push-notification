import React from "react";
import "./App.css";
import { ToastContainer, Flip } from "react-toastify";
import { Switch, Route } from "react-router-dom";

import GoogleMap from "./components/googleMaps";
import HomepageLayout from "./components/homePage";
function App() {
  return (
    <div className="App">
      <ToastContainer transition={Flip} />
      <Switch>
        <Route exact path="/">
          <HomepageLayout />
        </Route>
        <Route path="/maps">
          <GoogleMap />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
