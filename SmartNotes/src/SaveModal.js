import React, { Component } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import html2pdf from "html2pdf.js";
import { FileSaver, saveAs } from "file-saver";
import { HtmlToLatex } from "./LaTeX";

export default class SaveModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: props.visible,
      selected: null,
      okClicked: false
    };

    this.exportPDF = this.exportPDF.bind(this);
  }

  componentDidMount() {}

  handleChange = e => {
    this.setState({ selected: e.target.value });
  };

  handleOk = () => {
    this.setState({ okClicked: true });
  };

  //PDF Download
  exportPDF() {
    html2pdf()
      .from(this.props.rootDiv)
      .save(this.props.noteName.length > 0 ? this.props.noteName : "note");
  }

  render() {
    let modalContent = (
      <div className="saveAsWrapper">
        <div className="saveAsDiv" onClick={this.exportPDF}>
          <div className="innerSaveAsDiv">
            <img className="saveAsIcon" src="/saveAsPdf.png" alt="open"></img>
            <br />
            .pdf
          </div>
        </div>

        <div
          className="saveAsDiv"
          onClick={() => this.props.downloadLaTeX(this.props.noteName)}
        >
          <div className="innerSaveAsDiv">
            <img className="saveAsIcon" src="/saveAsTex.png" alt="open"></img>
            <br />
            .tex
          </div>
        </div>

        <div
          className="saveAsDiv"
          onClick={() => this.props.downloadHTML(this.props.noteName)}
        >
          <div className="innerSaveAsDiv">
            <img className="saveAsIcon" src="/saveAsNote.png" alt="open"></img>
            <br />
            .note
          </div>
        </div>
      </div>
    );

    return (
      <Modal
        title="Save as"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.props.changeVisible}
        centered
        footer={[]}
      >
        {modalContent}
      </Modal>
    );
  }
}
