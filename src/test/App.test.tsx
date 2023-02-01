import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  
  const nav = screen.getByRole('navigation');
  const main = screen.getByRole('main');
  const title = screen.getByText(/liferay-portal/);
  expect(nav).toBeInTheDocument();
  expect(main).toBeInTheDocument();
  expect(title).toBeInTheDocument();

});
