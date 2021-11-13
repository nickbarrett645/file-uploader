import { render, screen } from '@testing-library/react';
import ListView from './ListView';

test('renders learn react link', () => {
  render(<ListView />);
  const text = screen.getByText(/List View/i);
  expect(text).toBeInTheDocument();
});