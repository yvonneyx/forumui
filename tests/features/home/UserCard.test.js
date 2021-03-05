import React from 'react';
import { shallow } from 'enzyme';
import { UserCard } from '../../../src/features/home/UserCard';

describe('home/UserCard', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <UserCard {...props} />
    );

    expect(
      renderedComponent.find('.home-user-card').length
    ).toBe(1);
  });
});
