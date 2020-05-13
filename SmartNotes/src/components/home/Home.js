import React, { Component } from "react";

import { Link } from "react-router-dom";
import "./styleHome.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleKeyDown = e => {
    if (e.key === "Enter") {
      document.getElementById("link").click();
    }
  };

  render() {
    return (
      <div>
        <div className="start_body">
          <h1 className="smartNotesTitle">SmartNotes</h1>
          <p className="subtitle">Notes, but intelligent.</p>
          <input
            className="note_name"
            placeholder="Document name.."
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          ></input>
          <br />
          <Link
            id="link"
            to={{
              pathname: "/note",
              state: {
                noteName: this.state.name
              }
            }}
          >
            <button id="submit" type="submit" className="start_button">
              <span className="start_button_text">CREATE</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Home;
