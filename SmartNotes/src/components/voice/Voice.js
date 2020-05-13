import React, { Component } from "react";
import { getExactSymbolMatch } from "../../utils/symbolsUtils";
import { Popover } from "antd";

class Voice extends Component {
  recognition;
  recognizing;

  constructor(props) {
    super(props);

    this.state = {
      popupVisible: false,
    };

    this.setupVoice = this.setupVoice.bind(this);
    this.toggleStartStop = this.toggleStartStop.bind(this);
    this.handleSpeechResult = this.handleSpeechResult.bind(this);
    this.reset = this.reset.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }

  componentDidMount() {
    if (this.props.isChrome) this.setupVoice();
    else console.log("not chrome");
  }

  togglePopup() {
    this.setState((prevState) => ({
      popupVisible: !prevState.popupVisible,
    }));
  }

  /* --- VOICE --- */
  setupVoice() {
    this.recognizing = false;

    window.SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = true;

    this.reset();
    this.recognition.interimResults = true;

    this.recognition.onresult = this.handleSpeechResult;
  }

  toggleStartStop(e) {
    if (!this.props.isChrome) {
      this.togglePopup();
      return;
    }

    const button = document.getElementById("voice_button");
    document.activeElement.blur();
    if (this.recognizing) {
      this.recognition.stop();
      this.reset();
      button.classList.remove("recording");
    } else {
      this.recognition.start();
      this.recognizing = true;
      button.classList.add("recording");
    }
  }

  handleSpeechResult(event) {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        var symbol;
        let result = event.results[i][0].transcript;
        this.props.write(result.charAt(0).toUpperCase().charCodeAt(0));
        for (let i = 1; i < result.length; i++) {
          this.props.write(result.charCodeAt(i));
          // Om ordet är slut
          if (i + 1 === result.length || result.charCodeAt(i + 1) === 32) {
            var word = this.props.getCurrentWord().toLowerCase();
            console.log(word);
            symbol = getExactSymbolMatch(word);
            if (symbol != null) this.props.generateSymbol(symbol);
          }
        }
        if (symbol == null) {
          this.props.write(".".charCodeAt(0));
          this.props.write(" ".charCodeAt(0));
        }
      }
    }
  }

  reset() {
    this.recognizing = false;
  }

  render() {
    const text = <span>Sorry</span>;
    const content = (
      <div>
        <p>This feature is only supported in Google Chrome</p>
      </div>
    );

    return (
      <Popover
        placement="bottomLeft"
        title={text}
        content={content}
        visible={this.state.popupVisible}
        onBlur={() => this.setState({ popupVisible: false })}
      >
        <button
          title="Speech to text"
          className="whiteButton"
          id="voice_button"
          onClick={this.toggleStartStop}
        >
          <img
            className="headerIcon voice"
            src="/voiceWhite.png"
            alt="voice"
          ></img>
          <img
            className="headerIcon_behind voice"
            src="/voiceBlack.png"
            alt="voice"
          ></img>
        </button>
      </Popover>
    );
  }
}

export default Voice;
