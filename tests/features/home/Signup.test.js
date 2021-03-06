import React from 'react';
import { shallow } from 'enzyme';
import { Signup } from '../../../src/features/home/Signup';

describe('home/Signup', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Signup {...props} />
    );

    expect(
      renderedComponent.find('.home-signup').length
    ).toBe(1);
  });
});
