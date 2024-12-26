import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For jest-dom matchers like toBeInTheDocument
import App from './App';

test('renders learn Jenkins link', () => {
  render(<App />); // Render the App component
  const linkElement = screen.getByText(/learn Jenkins/i); // Look for the text "learn Jenkins"
  expect(linkElement).toBeInTheDocument(); // Assert that it exists in the DOM
});
