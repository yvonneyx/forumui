import React from 'react';
import { shallow } from 'enzyme';
import { Accueil } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Accueil />);
  expect(renderedComponent.find('.home-accueil').length).toBe(1);
});
