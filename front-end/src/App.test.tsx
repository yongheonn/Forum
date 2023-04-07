import React from 'react';
import { render, screen } from '@testing-library/react';
import AccountMenu from './Containers/AccountMenu';

test('renders learn react link', () => {
  render(<AccountMenu />);
  const linkElement = screen.getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
  screen.debug();
});
