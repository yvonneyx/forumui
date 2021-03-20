import React from 'react';
import { shallow } from 'enzyme';
import { PrivateChatView } from '../../../src/features/chat';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PrivateChatView />);
  expect(renderedComponent.find('.chat-private-chat-view').length).toBe(1);
});
