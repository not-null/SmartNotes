import Home from "../components/home/Home";
import React from "react";
import { shallow } from "enzyme";

describe("HomePage", () => {
  it("renders without crashing", () => {
    shallow(<Home />);
  });

  it("check text", () => {
    const wrapper = shallow(<Home />);
    const text = wrapper.find(".smartNotesTitle");
    expect(text.text()).toBe("SmartNotes");
  });
});
