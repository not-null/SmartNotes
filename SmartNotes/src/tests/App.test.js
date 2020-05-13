import App from "../App";
import React from "react";
import ReactDOM from "react-dom";

//Tries to render App and all of its child components
it("renders without crashing", () => {
  const div = document.createElement("div");
  div.setAttribute("id", "root");
  ReactDOM.render(<App />, div);
});
