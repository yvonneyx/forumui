import React from 'react';
import { shallow } from 'enzyme';
import { AvatarWithInvitation } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<AvatarWithInvitation />);
  expect(renderedComponent.find('.common-avatar-with-invitation').length).toBe(1);
});
