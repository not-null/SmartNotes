import Note from './Note';
import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import { Keyboard } from 'test-keyboard';
import { fireEvent, wait } from '@testing-library/react';
import ReactTestUtils, { Simulate } from 'react-dom/test-utils';
import sinon from 'sinon';


beforeAll(() => {

    const div = document.createElement('div');
    div.setAttribute("id", "root");
    window.domNode = div;
    document.body.appendChild(div);
  })

describe('Note', () => {
    let webpage;
    
    //Tries to render only the Note component
    it('renders without crashing', () => {
        mount(<Note />, { attachTo: window.domNode });
        webpage = shallow(<Note />, { attachTo: window.domNode });
    });

    it('calls componentDidMount', () => {
        sinon.spy(Note.prototype, 'componentDidMount');
        mount(<Note />);
        expect(Note.prototype.componentDidMount).toHaveProperty('callCount', 1);
      });

    it('creates first row', () => {
        sinon.spy(Note.prototype, 'createRowDiv');
        mount(<Note />);
        expect(Note.prototype.createRowDiv).toHaveProperty('callCount', 1);
    })

    it ('creates first word', () => {
        sinon.spy(Note.prototype, 'createWordDiv');
        mount(<Note />);
        expect(Note.prototype.createWordDiv).toHaveProperty('callCount', 1);
    })

    it('renders saveButton', () => {
        expect(webpage.find('button').first().hasClass('whiteButton')).toBe(true);
    })

    it('can toggle SaveModal', () => {
        expect(webpage.state('modalVisible')).toBe(false);
        webpage.find('button').first().props().onClick();
        expect(webpage.state('modalVisible')).toBe(true);
    })

    // Checks if you can write a letter 'a' and it appears in the document
    // it('can receive keyboard input', () => {

    //     const wrapper = mount(<Note />);
    //     const temp = wrapper.find(".name");
    //     console.log(wrapper.html());

    //     console.log(temp.text());

    //     const note = wrapper.find(".note");

    //     // You could call key down for example

    //     // wrapper.find('input').prop('onKeyDown')({ key: 'Enter' }) 
    //     // or

    //     // wrapper.find('input').props().onKeyDown({ key: 'Enter' }) 

    //     // wrapper.find('.note').prop('onkeypress')({ keyCode: '97'});

    //     //note.simulate('keypress', {keyCode: 97});
    //     //wrapper.find('.note').simulate('keypress', { key: 'a' ,keyCode: 65, which: 65});

    //     //console.log(wrapper.find('.note').getDOMNode());

    //     console.log(document.activeElement);
    //     wait (() => {
    //         fireEvent.focus(note.getDOMNode());
    //         Simulate.keyPress(note.getDOMNode(), { key: "a", keyCode: 97, which: 97 });

    //     });

    //     expect(wrapper.logKey).toHaveBeenCalled();

    //     console.log(wrapper.find(".note").html());

    //     //wrapper.update();
    //     //simulateKeypress (wrapper.find('.note').getElement(), 'a');

    //     // expect(wrapper.find("div")).toBeNull();


    //     //Check that the input was written
    //     // expect(
    //     //     wrapper.find('.wordDiv').childAt(1).contains('a')
    //     //     ).toEqual(true);



    //     // expect(3).toEqual(5);
    // });

    // const simulateKeypress = (element, key) => {
    //     let code = key.charCodeAt(0);
    //     const event = new KeyboardEvent('keypress', { key: key, charCode: code, keyCode: code });
    //     element.dispatchEvent(event);
    // };

    // it('can generate suggestion', () => {
    //     const div = document.createElement('div');
    //     div.setAttribute("id", "root");
    //     const webpage = shallow(<Note />, div);

    //     //Press a key
    //     webpage.find('.note').simulate('keypress', {key: 'a'});

    //     //Check that the input was written
    //     expect(
    //         webpage.find('.wordDiv').at(0).childAt(1).contains('a')
    //         ).toEqual(true);

    //     //Klicka på förslag
    //     webpage.find('.suggestion_name').at(0).simulate('click');

    //     //Kolla att det stämmer
    //     expect(
    //         webpage.find('.wordDiv').at(0).childAt(1).contains('a')
    //         ).toEqual(true);
    // });  
});