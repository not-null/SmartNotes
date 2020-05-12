import React, { Component, useCallback } from "react";
import "./styleNote.css";
import { useDropzone } from "react-dropzone";
import { HtmlToLatex } from "./LaTeX";

export function downloadHTML(noteName) {
  console.log(noteName);
  var filename = noteName.length > 0 ? noteName + ".note" : "note.note";
  var elementId = "content";
  var element = document.getElementById(elementId);
  var elementHtml = element.innerHTML;
  var link = document.createElement("a");

  link.setAttribute("download", filename);
  link.setAttribute(
    "href",
    "data:" + ".note" + ";charset=utf-8," + encodeURIComponent(elementHtml) // eslint-disable-line no-useless-concat
  );
  link.click();
}

export function downloadLaTeX(noteName) {
  console.log("anropade downloadlatex");
  var data = HtmlToLatex(noteName);

  console.log(noteName);
  var filename = noteName.length > 0 ? noteName + ".tex" : "note.tex";

  var link = document.createElement("a");

  link.setAttribute("download", filename);
  link.setAttribute(
    "href",
    "data:" + ".tex" + ";charset=utf-8," + encodeURIComponent(data) // eslint-disable-line no-useless-concat
  );
  link.click();
}

export class ImportFileHandler extends Component {
  fileReader;
  currentDiv;

  constructor(props) {
    super(props);
    console.log(this.props.currentDiv);
    this.currentDiv = this.props.currentDiv;
  }

  loadHtml = () => {
    console.log("i");
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".note";
    input.click();

    input.onchange = e => {
      this.handleFileChosen(e.target.files[0]);
    };
  };

  handleFileRead = e => {
    const content = this.fileReader.result;
    console.log("is here");
    //do something with content
    document.getElementById("content").innerHTML = content;
    this.props.registerEventHandlers();
  };

  handleFileChosen = file => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.handleFileRead;
    this.fileReader.readAsText(file);
  };

  MyDropzone() {
    const onDrop = useCallback(acceptedFiles => {
      // Do something with the files
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop
    });

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    );
  }

  render() {
    return (
      <div style={{ display: "inline-block" }}>
        {/* <Dropzone
          noClick
          onDrop={acceptedFiles => {
            console.log(acceptedFiles);
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()} className="dropZone" />
          )}
        </Dropzone> */}
        <button
          className="whiteButton"
          onClick={this.loadHtml}
          title="Open file"
        >
          <img
            className="headerIcon open"
            src={process.env.PUBLIC_URL + "/OpenWhite.png"}
            alt="open"
          ></img>
          <img
            className="headerIcon_behind open"
            src={process.env.PUBLIC_URL + "/OpenBlack.png"}
            alt="open"
          ></img>
        </button>
      </div>
    );
  }
}
