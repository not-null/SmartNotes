import React, { Component } from "react";
import "./styleNote.css";
import { downloadLaTeX, downloadHTML, ImportFileHandler } from "./fileIO";
import SaveModal from "./SaveModal";

import Voice from "./Voice";
import { rowsNeededForSymbol } from "./symbolsUtils";
import SuggestionTable from "./SuggestionTable";

class Note extends Component {
  stop;
  start;
  rootDiv;
  currentRow;
  currentDiv;
  currentChar;
  id;
  cursor;
  isChrome;

  constructor(props) {
    super(props);
    this.state = { noteName: "", modalVisible: false };
    this.id = 0;

    this.logKey = this.logKey.bind(this);
    this.specialKey = this.specialKey.bind(this);
    this.getID = this.getID.bind(this);
    this.createWordDiv = this.createWordDiv.bind(this);
    this.getCurrentWord = this.getCurrentWord.bind(this);
    this.getCurrentDiv = this.getCurrentDiv.bind(this);
    this.insertAfter = this.insertAfter.bind(this);
    this.generateSymbol = this.generateSymbol.bind(this);
    this.moveCursor = this.moveCursor.bind(this);
    this.handleSpace = this.handleSpace.bind(this);
    this.createRowDiv = this.createRowDiv.bind(this);
    this.updateCurrentRow = this.updateCurrentRow.bind(this);
    this.threeRowSymbol = this.threeRowSymbol.bind(this);
    this.createDiv = this.createDiv.bind(this);
    this.createLetter = this.createLetter.bind(this);
    this.registerEventHandlers = this.registerEventHandlers.bind(this);
    this.noteListener = this.noteListener.bind(this);
    this.write = this.write.bind(this);
    this.handleTab = this.handleTab.bind(this);

    this.isChrome =
      !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    this.child = React.createRef();
  }

  componentDidMount() {
    this.stop = document.getElementById("stop");
    this.start = document.getElementById("start");
    document.addEventListener("keypress", this.logKey);
    document.addEventListener("keydown", this.specialKey);

    this.currentDiv = document.getElementById("content");
    this.rootDiv = document.getElementById("content");
    this.cursor = document.getElementById("cursor");

    if (this.props.location && this.props.location.state) {
      this.setState({ noteName: this.props.location.state.noteName });
    } else {
      this.setState({ noteName: "Note" });
    }
    console.log("start: " + this.start);
    this.createRowDiv(this.start);

    document
      .getElementById("note")
      .addEventListener("click", this.noteListener);

    window.addEventListener("resize", this.moveCursor);
  }

  //När man trycker utanför texten
  noteListener(e) {
    var row;
    switch (e.target.id) {
      case "note":
        row = this.stop.previousSibling;
        break;
      case "row_div":
        row = e.target;
        break;
      default:
        return;
    }
    var lastChild = row.lastChild;
    this.currentDiv = lastChild;
    if (!lastChild.classList.contains("spaceDiv")) {
      lastChild = lastChild.lastChild;
      this.currentDiv = lastChild.parentNode;
    }

    this.currentChar = lastChild;
    this.moveCursor();
    this.updateCurrentRow();
  }

  createDiv(className, id) {
    var newDiv = document.createElement("div");
    newDiv.classList.add(className);
    if (id !== null) {
      newDiv.setAttribute("id", id);
    }
    return newDiv;
  }

  generateSymbol(symbol) {
    // Delete current word
    this.currentDiv.innerHTML = "";
    var newCharDiv = this.createDiv("letter", this.getID());
    this.currentDiv.appendChild(newCharDiv);

    // create a new div element
    var symbolWrapperDiv = this.createDiv("symbolWrapper", this.getID());

    var content = symbol;

    // and give it some content
    var newContent = document.createTextNode(content);

    // add the text node to the newly created div
    var symbolDiv = this.createDiv("symbol", null);
    symbolDiv.appendChild(newContent);
    symbolDiv.addEventListener("click", () => {
      this.currentChar = symbolWrapperDiv;
      this.moveCursor();
    });

    symbolWrapperDiv.appendChild(symbolDiv);
    //Update current char
    this.currentChar = symbolWrapperDiv;

    this.currentDiv.appendChild(symbolWrapperDiv);

    switch (rowsNeededForSymbol(symbol)) {
      case 2:
        break;
      case 3:
        this.threeRowSymbol(symbolWrapperDiv);
        break;
      default:
    }

    if (this.currentDiv.id === "row_div") {
      this.createWordDiv();
    }

    this.child.current.fillSuggestionTable();
    this.moveCursor();
  }

  handleSpace() {
    //Space in the middle of a word
    var inTheMiddle =
      this.currentChar != null &&
      this.currentChar.nextSibling != null &&
      !this.currentDiv.classList.contains("spaceDiv");

    var charsToMove = [];

    if (inTheMiddle) {
      var iterator = this.currentChar.nextSibling;
      var charToMove;

      do {
        charToMove = iterator;
        charsToMove.push(charToMove);
        iterator = iterator.nextSibling;
        charToMove.parentNode.removeChild(charToMove);
      } while (iterator != null);
    }

    var spaceDiv = this.createDiv("spaceDiv", this.getID());
    spaceDiv.innerHTML = "&nbsp";
    spaceDiv.addEventListener("click", () => {
      this.currentChar = spaceDiv;
      this.currentDiv = spaceDiv;
      this.moveCursor();
    });

    if (this.currentDiv == null || this.currentDiv.id === "content") {
      this.rootDiv.insertBefore(spaceDiv, this.stop);
    } else {
      this.insertAfter(spaceDiv, this.currentDiv);
    }

    this.currentDiv = spaceDiv;
    this.currentChar = spaceDiv;
    this.moveCursor();

    //Space in the middle of a word
    if (inTheMiddle) {
      var savedCurrentChar = this.currentChar;
      var savedCurrentDiv = this.currentDiv;
      this.createWordDiv();
      charsToMove.forEach((char) => {
        this.insertAfter(char, this.currentChar);
        this.currentChar = char;
      });
      this.currentChar = savedCurrentChar;
      this.currentDiv = savedCurrentDiv;
    }
  }

  threeRowSymbol(symbolWrapperDiv) {
    symbolWrapperDiv.classList.add("threeRow");
    //Upper Bound
    var upperDiv = this.createDiv("upperBound", "upper_bound");
    symbolWrapperDiv.insertBefore(upperDiv, symbolWrapperDiv.childNodes[0]);

    this.currentDiv = upperDiv;
    this.createWordDiv();

    var upperLetterDiv = this.createLetter();
    upperLetterDiv.appendChild(document.createTextNode("a"));

    this.currentDiv.appendChild(upperLetterDiv);

    //Lower Bound
    var lowerDiv = this.createDiv("lowerBound", "lower_bound");
    symbolWrapperDiv.appendChild(lowerDiv);

    this.currentDiv = lowerDiv;
    this.createWordDiv();

    var lowerLetterDiv = this.createLetter();
    lowerLetterDiv.appendChild(document.createTextNode("b"));

    this.currentDiv.appendChild(lowerLetterDiv);

    //Start writing in upper -- NOT
    this.currentDiv = upperDiv.parentNode.parentNode;
    this.currentChar = symbolWrapperDiv;
  }

  createLetter() {
    var newCharDiv = this.createDiv("letter", this.getID());
    newCharDiv.addEventListener("click", () => {
      this.currentChar = newCharDiv;
      this.moveCursor();
      this.updateCurrentRow();
    });
    return newCharDiv;
  }

  logKey(e) {
    console.log(e.keyCode);

    if (e.keyCode === 32) {
      e.preventDefault();
    }

    this.write(e.keyCode);
  }

  write(keyCode) {
    let main = document.getElementById("content");

    // Space
    if (keyCode === 32) {
      this.handleSpace();
      this.child.current.hideSuggestionTable();
      return;
    } else if (keyCode === 13) {
      //Enter
      console.log("Enter");
      this.createRowDiv(this.currentRow);
      //Hide suggestions
      this.child.current.hideSuggestionTable();
      return;
    }
    // create a new div element
    var newCharDiv = this.createLetter();

    var content = String.fromCharCode(keyCode);

    // and give it some content
    var newContent = document.createTextNode(content);
    // add the text node to the newly created div
    newCharDiv.appendChild(newContent);

    console.log("DIV");
    console.log(this.currentDiv);

    if (
      this.currentDiv == null ||
      this.currentDiv.classList.contains("spaceDiv") ||
      this.currentDiv.id === "row_div"
    ) {
      this.createWordDiv();

      // this.currentDiv.insertBefore(newCharDiv, this.stop);
    }
    //  this.currentDiv.appendChild(newCharDiv);

    if (this.currentChar == null) {
      this.currentDiv.appendChild(newCharDiv);
      console.log("current char är null");
    } else {
      this.insertAfter(newCharDiv, this.currentChar);
    }

    this.currentChar = newCharDiv;

    console.log(this.currentChar);

    if (keyCode === 109) {
      this.getCurrentWord();
    }

    this.child.current.fillSuggestionTable();

    this.moveCursor();
  }

  specialKey(e) {
    if (this.currentChar == null) return;
    if (e.keyCode === 8) {
      console.log("delete");
      console.log(this.currentChar);

      //if (this.currentChar.innerHTML == "") return;

      //Hide suggestions
      this.child.current.hideSuggestionTable();

      // Om man tar bort ett mellanslag
      if (this.currentChar.classList.contains("spaceDiv")) {
        var previous = this.currentChar.previousSibling;
        var next = this.currentChar.nextSibling;
        console.log(next);
        this.currentChar.parentNode.removeChild(this.currentChar);

        // Om det inte är det enda på sidan
        if (previous !== null) {
          // Om det är ett ord innan
          if (previous.classList.contains("wordDiv")) {
            this.currentChar = previous.lastChild;

            if (next !== null && next.classList.contains("wordDiv")) {
              var iterator = next.firstChild;
              var charToMove;
              var charsToMove = [];

              do {
                charToMove = iterator;
                charsToMove.push(charToMove);
                iterator = iterator.nextSibling;
                charToMove.parentNode.removeChild(charToMove);
              } while (iterator !== null);

              var savedCurrentChar = this.currentChar;

              charsToMove.forEach((char) => {
                this.insertAfter(char, this.currentChar);
                this.currentChar = char;
              });

              this.currentChar = savedCurrentChar;
            }
          }
          // Om det är ett space innan
          else {
            this.currentChar = previous;
          }
          this.currentDiv = previous;
        } else {
          this.currentChar = null;
          this.currentDiv = null;
        }
      }
      // Om man tar bort det sista tecknet i ett ord
      else if (
        this.currentChar.parentNode.childNodes.length === 2 &&
        this.currentChar.innerHTML !== ""
      ) {
        var parent = this.currentChar.parentNode;
        var beforeParent = parent.previousSibling;
        if (beforeParent == null) {
          previous = this.currentChar.previousSibling;
          this.currentChar.parentNode.removeChild(this.currentChar);
          this.currentChar = previous;
        } else {
          this.currentChar.parentNode.parentNode.removeChild(parent);
          this.currentChar = beforeParent;
          this.currentDiv = beforeParent;
        }
      }
      // Om man tar bort ett godtyckligt tecken
      else if (this.currentChar.innerHTML !== "") {
        var previousLetter = this.currentChar.previousSibling;
        this.currentChar.parentNode.removeChild(this.currentChar);
        this.currentChar = previousLetter;
        console.log("new currentChar");
        console.log(this.currentChar);

        //Om man tar bort det första tecknet och det finns tecken kvar i ordet
        if (
          this.currentChar.innerHTML === "" &&
          this.currentChar.parentNode.parentNode.previousSibling.classList.contains(
            "spaceDiv"
          )
        ) {
          this.currentChar = this.currentChar.parentNode.previousSibling;
        }
      }

      if (this.rootDiv.childNodes.length < 4) {
        this.currentChar = null;
        this.currentDiv = null;
      }
    } else if (e.keyCode === 9) {
      this.handleTab(e);
    }

    this.moveCursor();
  }

  handleTab(e) {
    e.preventDefault();
    this.handleSpace();
    this.handleSpace();
    this.handleSpace();
    this.handleSpace();
  }

  getID() {
    return ++this.id;
  }

  createRowDiv(before) {
    var newRowDiv = this.createDiv("rowDiv", "row_div");

    this.insertAfter(newRowDiv, before);
    this.currentDiv = newRowDiv;
    this.currentRow = newRowDiv;
    this.currentChar = newRowDiv;
    this.createWordDiv();

    this.moveCursor();
  }

  createWordDiv() {
    var newCharDiv = this.createDiv("letter", this.getID());

    var newWordDiv = this.createDiv("wordDiv", "word_div");
    newWordDiv.addEventListener("click", () => {
      this.currentDiv = newWordDiv;
    });

    if (this.currentDiv.id === "row_div") {
      console.log("THIS ONE");
      this.currentRow.appendChild(newWordDiv);
    } else if (this.currentDiv.id.includes("bound")) {
      this.currentDiv.appendChild(newWordDiv);
    } else {
      console.log("THAT ONE");
      this.insertAfter(newWordDiv, this.currentDiv);
    }
    this.currentDiv = newWordDiv;
    this.currentDiv.appendChild(newCharDiv);
    this.currentChar = newCharDiv;
  }

  getCurrentWord() {
    var children = Array.from(this.currentDiv.children);
    var word = "";
    children.map((c) => {
      word += c.innerHTML;
      return null;
    });
    console.log(word);

    return word;
  }

  getCurrentDiv() {
    return this.currentDiv;
  }

  insertAfter(newNode, refNode) {
    if (refNode.nextSibling !== null)
      refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
    else {
      refNode.parentNode.appendChild(newNode);
    }
  }

  moveCursor() {
    if (this.currentChar == null) {
      this.cursor.style.left = "100px";
      return;
    }

    if (
      this.currentChar.parentNode.parentNode.id.includes("bound") &&
      this.cursor.style.height !== "0.5rem"
    ) {
      this.cursor.style.height = "0.5rem";
    } else if (
      !this.currentChar.parentNode.parentNode.id.includes("bound") &&
      this.cursor.style.height !== "1.25rem"
    ) {
      this.cursor.style.height = "1.25rem";
    }

    var x = this.currentChar.offsetLeft,
      y = this.currentChar.offsetTop;
    this.cursor.style.left = x + this.currentChar.offsetWidth + "px";
    // console.log("currentChar:");
    // console.log(this.currentChar);
    if (this.currentChar.innerHTML === "") {
      this.cursor.style.top = y - 13 + "px";
    } else if (this.currentChar.parentNode.parentNode.id.includes("bound")) {
      this.cursor.style.top = y + "px";
    } else if (this.currentChar.classList.contains("threeRow")) {
      this.cursor.style.top = y + 16 + "px";
    } else {
      this.cursor.style.top = y + 3 + "px";
    }
  }

  updateCurrentRow() {
    var i = this.currentChar;
    while (!i.parentNode.classList.contains("rowDiv")) {
      i = i.parentNode;
    }
    this.currentRow = i.parentNode;
  }

  registerEventHandlers = () => {
    var wordDivs = document.getElementsByClassName("wordDiv");
    for (let word of wordDivs) {
      word.addEventListener("click", () => {
        this.currentDiv = word;
        console.log(this.currentDiv);
      });
    }
    var letterDivs = document.getElementsByClassName("letter");
    for (let letter of letterDivs) {
      letter.addEventListener("click", () => {
        this.currentChar = letter;
        this.moveCursor();
        this.updateCurrentRow();
      });
    }

    var symbolDivs = document.getElementsByClassName("symbol");
    for (let symbol of symbolDivs) {
      symbol.addEventListener("click", () => {
        this.currentChar = symbol.parentNode;
        this.moveCursor();
      });
    }

    var spaceDivs = document.getElementsByClassName("spaceDiv");
    for (let space of spaceDivs) {
      space.addEventListener("click", () => {
        this.currentChar = space;
        this.currentDiv = space;
        this.moveCursor();
      });
    }
    this.stop = document.getElementById("stop");
    var lastChar = this.stop.previousSibling.lastChild;

    if (lastChar !== null) {
      switch (lastChar.classList.item(0).toString()) {
        case "wordDiv":
          this.currentChar = lastChar.lastChild;
          this.currentDiv = lastChar;
          break;
        case "symbolWrapper":
          this.currentChar = lastChar.childNodes.getElementsByClassName(
            "symbol"
          )[0];
          this.currentDiv = lastChar.parent;
          break;
        case "spaceDiv":
          this.currentChar = lastChar;
          this.currentDiv = lastChar;
          break;
        default:
      }
    }

    this.moveCursor();
  };

  toggleModal = (prevState) => {
    this.setState((prevState) => ({
      modalVisible: !prevState.modalVisible,
    }));
  };

  render() {
    return (
      <div id="wrapper" className="wrapper">
        <div id="header" className="blackHeader">
          <ImportFileHandler
            registerEventHandlers={this.registerEventHandlers}
          />
          <button
            className="whiteButton"
            onClick={this.toggleModal}
            title="Save to device"
          >
            <img
              className="headerIcon save"
              src="/saveWhite.png"
              alt="open"
            ></img>
            <img
              className="headerIcon_behind save"
              src="/saveBlack.png"
              alt="open"
            ></img>
          </button>
          <span className="noteName">{this.state.noteName}</span>
          <span className="right">
            <Voice
              write={this.write}
              getCurrentWord={this.getCurrentWord}
              generateSymbol={this.generateSymbol}
              isChrome={this.isChrome}
            />
          </span>
        </div>
        <div id="note" className="note">
          <div className="main" id="content">
            <div id="start"></div>
            <div id="stop"></div>
            <SuggestionTable
              generateSymbol={this.generateSymbol}
              getCurrentWord={this.getCurrentWord}
              getCurrentDiv={this.getCurrentDiv}
              ref={this.child}
            />
          </div>
          <div className="cursor" id="cursor"></div>
        </div>

        <SaveModal
          visible={this.state.modalVisible}
          changeVisible={this.toggleModal}
          downloadHTML={downloadHTML}
          downloadLaTeX={downloadLaTeX}
          noteName={this.state.noteName}
          rootDiv={this.rootDiv}
        />
      </div>
    );
  }
}

export default Note;
