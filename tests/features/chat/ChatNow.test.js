import React from 'react';
import { shallow } from 'enzyme';
import { ChatNow } from '../../../src/features/chat';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ChatNow />);
  expect(renderedComponent.find('.chat-chat-now-single-widget').length).toBe(1);
});
