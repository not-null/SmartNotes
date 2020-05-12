import React, { Component } from "react";
import { getSuggestions } from "./symbolsUtils";

class SuggestionTable extends Component {
  suggestionsTable;

  constructor(props) {
    super(props);

    this.fillSuggestionTable = this.fillSuggestionTable.bind(this);
    this.addSuggestion = this.addSuggestion.bind(this);
    this.clearSuggestionTable = this.clearSuggestionTable.bind(this);
    this.moveSuggestionTable = this.moveSuggestionTable.bind(this);
  }

  componentDidMount() {
    this.suggestionsTable = document.getElementById("suggestionsTable");
  }

  fillSuggestionTable() {
    this.moveSuggestionTable();
    this.clearSuggestionTable();
    var word = this.props.getCurrentWord();
    var suggestions = getSuggestions(word);
    suggestions.slice(0, 5).forEach((element) => {
      this.addSuggestion(element);
    });
    this.suggestionsTable.style.opacity = 1;
  }

  clearSuggestionTable() {
    while (this.suggestionsTable.firstChild) {
      this.suggestionsTable.removeChild(this.suggestionsTable.firstChild);
    }
  }

  addSuggestion(element) {
    var suggestionTr = document.createElement("tr");
    suggestionTr.classList.add("suggestion");
    suggestionTr.tabIndex = 0;

    suggestionTr.innerHTML =
      "<span class='suggestion_name'>" +
      element.name +
      "</span><span class='suggestion_symbol'>" +
      element.unicode +
      "</span>";

    suggestionTr.onclick = () => {
      this.props.generateSymbol(element.unicode);
      console.log(element.unicode);
    };

    this.suggestionsTable.appendChild(suggestionTr);
  }

  hideSuggestionTable() {
    this.suggestionsTable.style.opacity = 0;
  }

  moveSuggestionTable() {
    var x = this.props.getCurrentDiv().offsetLeft;
    this.suggestionsTable.style.left = x + "px";
  }

  render() {
    return <table id="suggestionsTable"></table>;
  }
}

export default SuggestionTable;
