import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Note from "./components/note/Note";
import Home from "./components/home/Home";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/note" component={Note} />
      </Router>
    );
  }
}

export default App;
