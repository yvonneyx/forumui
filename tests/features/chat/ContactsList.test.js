import React from 'react';
import { shallow } from 'enzyme';
import { ContactsList } from '../../../src/features/chat';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ContactsList />);
  expect(renderedComponent.find('.chat-contacts-widget').length).toBe(1);
});
