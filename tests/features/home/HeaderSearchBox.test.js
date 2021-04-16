import React from 'react';
import { shallow } from 'enzyme';
import { HeaderSearchBox } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<HeaderSearchBox />);
  expect(renderedComponent.find('.home-header-search-box').length).toBe(1);
});
