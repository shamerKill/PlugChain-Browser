import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders learn react link', async () => {
    render(<App />);
    const hello = await screen.findAllByText(/hello world/i);
    expect(hello.length).toBe(1);
  });
})
