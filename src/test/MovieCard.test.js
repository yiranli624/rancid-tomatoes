import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieCard from '../components/MovieCard';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
  _notOnWatchListMovie,
  _onWatchListMovie,
} from './mockData/movieCardMockData';

describe('MovieCard Component', () => {
  it('should render correctly', () => {
    render(
      <MovieCard
        movies={_notOnWatchListMovie}
        addToWatchList={jest.fn()}
        removeFromWatchList={jest.fn()}
      />,
      { wrapper: MemoryRouter }
    );

    const movieTitle = screen.getByText(/Inside out/i);
    const movieReleaseDate = screen.getByText(/Jun 24, 2018/i);
    const moviePosters = screen.getAllByRole(/img/i);

    expect(movieTitle).toBeInTheDocument();
    expect(movieReleaseDate).toBeInTheDocument();
    expect(moviePosters).toHaveLength(3);
  });

  it('should call addToWatchList function with correct id', () => {
    const mockAddToWatchList = jest.fn();
    render(
      <MovieCard
        movies={_notOnWatchListMovie}
        addToWatchList={mockAddToWatchList}
        removeFromWatchList={jest.fn()}
      />,
      { wrapper: MemoryRouter }
    );

    const moviePosters = screen.getAllByRole(/img/i);
    userEvent.click(moviePosters[1]);

    expect(mockAddToWatchList).toBeCalledWith(1);
  });

  it('should cal removeFromWatchList function with correct id', () => {
    const mockRemoveFromWatchList = jest.fn();
    render(
      <MovieCard
        movies={_onWatchListMovie}
        addToWatchList={jest.fn()}
        removeFromWatchList={mockRemoveFromWatchList}
      />,
      { wrapper: MemoryRouter }
    );

    const moviePosters = screen.getAllByRole(/img/i);
    userEvent.click(moviePosters[1]);

    expect(mockRemoveFromWatchList).toBeCalledWith(1);
  });
});
