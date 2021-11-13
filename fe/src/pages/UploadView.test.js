import { render, screen } from '@testing-library/react';
import UploadView from './UploadView';

test('renders learn react link', () => {
  render(<UploadView />);
  const text = screen.getByText(/Upload View/i);
  expect(text).toBeInTheDocument();
});