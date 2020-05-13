import Note from "../components/note/Note";
import React from "react";
import { shallow, mount } from "enzyme";
import sinon from "sinon";

beforeAll(() => {
  const div = document.createElement("div");
  div.setAttribute("id", "root");
  window.domNode = div;
  document.body.appendChild(div);
});

describe("Note", () => {
  let webpage;

  //Tries to render only the Note component
  it("renders without crashing", () => {
    mount(<Note />, { attachTo: window.domNode });
    webpage = shallow(<Note />, { attachTo: window.domNode });
  });

  it("calls componentDidMount", () => {
    sinon.spy(Note.prototype, "componentDidMount");
    mount(<Note />);
    expect(Note.prototype.componentDidMount).toHaveProperty("callCount", 1);
  });

  it("creates first row", () => {
    sinon.spy(Note.prototype, "createRowDiv");
    mount(<Note />);
    expect(Note.prototype.createRowDiv).toHaveProperty("callCount", 1);
  });

  it("creates first word", () => {
    sinon.spy(Note.prototype, "createWordDiv");
    mount(<Note />);
    expect(Note.prototype.createWordDiv).toHaveProperty("callCount", 1);
  });

  it("renders saveButton", () => {
    expect(webpage.find("button").first().hasClass("whiteButton")).toBe(true);
  });

  it("can toggle SaveModal", () => {
    expect(webpage.state("modalVisible")).toBe(false);
    webpage.find("button").first().props().onClick();
    expect(webpage.state("modalVisible")).toBe(true);
  });
});
