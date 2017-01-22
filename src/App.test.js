import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {mount} from 'enzyme';
import sinon from 'sinon';

describe("Watch with fake time", function () {
  var clock;
  beforeEach(function () {
    clock = sinon.useFakeTimers(new Date(2011, 9, 1, 0, 0, 0).getTime());
  })
  afterEach(function () {
    clock.restore();
  })

  it('should renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <App/>, div);
  });

  it('should shows 3 needles', () => {
    const wrapper = mount(<App/>);
    expect(wrapper.find('line').length).toEqual(3);
    expect(wrapper.find('circle').length).toEqual(2);
  });

  it('should be upward at 00:00:00', () => {
    const wrapper = mount(<App/>);
    wrapper
      .find('line')
      .forEach(function (node) {
        expect(node.prop('x1')).toEqual(node.prop('x2'));
      });
  });

  it('should move the seconds needle', () => {
    const wrapper = mount(<App/>);
    var line = wrapper
      .find('line')
      .at(2);
    var firstX = line.prop('x2');
    clock.tick(1000);
    var secondX = line.prop('x2');
    expect(secondX).toBeGreaterThan(firstX);
  });

  it('should change color on click', () => {
    const wrapper = mount(<App/>);
    var col1 = wrapper.node.state.curColor;
    wrapper
      .find('svg')
      .simulate('mousedown');
    var col2 = wrapper.node.state.curColor;
    expect(col1)
      .not
      .toEqual(col2);
  });

  it('should change watch type', () => {
    const wrapper = mount(<App/>);
    expect(wrapper.find('text').length).toEqual(0);
    wrapper
      .find("#change-watch")
      .simulate('change', {
        target: {
          checked: true
        }
      });
    expect(wrapper.find('text').text()).toEqual('00:00:00');
  });
})
