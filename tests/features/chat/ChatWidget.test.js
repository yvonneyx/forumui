import React from 'react';
import { shallow } from 'enzyme';
import { ChatWidget } from '../../../src/features/chat';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ChatWidget />);
  expect(renderedComponent.find('.chat-chat-widget').length).toBe(1);
});
