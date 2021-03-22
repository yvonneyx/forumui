import React from 'react';
import { shallow } from 'enzyme';
import { Profile } from '../../../src/features/home/Profile';

describe('home/Profile', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <Profile {...props} />
    );

    expect(
      renderedComponent.find('.home-profile').length
    ).toBe(1);
  });
});
