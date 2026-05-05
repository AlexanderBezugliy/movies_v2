import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TVShowCard from './TVShowCard';

const mockTVShow = {
  id: 123,
  name: 'Тестовый сериал',
  original_name: 'Test TV Show',
  poster_path: '/test-poster.jpg',
  vote_average: 8.5,
  genre_ids: [1, 2],
};

const mockGenres = [
  { id: 1, name: 'Драма' },
  { id: 2, name: 'Комедия' },
];

describe('TVShowCard', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders TV show title correctly', () => {
    render(
      <TVShowCard
        tvShow={mockTVShow}
        genres={mockGenres}
        index={0}
        language="ru-RU"
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Тестовый сериал')).toBeDefined();
  });

  it('renders TV show title in English when language is en-US', () => {
    render(
      <TVShowCard
        tvShow={mockTVShow}
        genres={mockGenres}
        index={0}
        language="en-US"
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Test TV Show')).toBeDefined();
  });

  it('renders rating correctly', () => {
    render(
      <TVShowCard
        tvShow={mockTVShow}
        genres={mockGenres}
        index={0}
        language="ru-RU"
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('8.5')).toBeDefined();
  });

  it('renders genres correctly', () => {
    render(
      <TVShowCard
        tvShow={mockTVShow}
        genres={mockGenres}
        index={0}
        language="ru-RU"
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText(/Драма/)).toBeDefined();
  });

  it('calls onClick handler when clicked', () => {
    render(
      <TVShowCard
        tvShow={mockTVShow}
        genres={mockGenres}
        index={0}
        language="ru-RU"
        onClick={mockOnClick}
      />
    );
    
    const card = document.querySelector('.tv-show-card');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders placeholder when poster is not available', () => {
    const tvShowWithoutPoster = { ...mockTVShow, poster_path: null };
    
    render(
      <TVShowCard
        tvShow={tvShowWithoutPoster}
        genres={mockGenres}
        index={0}
        language="ru-RU"
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('📺')).toBeDefined();
  });

  it('renders correctly with missing genres', () => {
    render(
      <TVShowCard
        tvShow={mockTVShow}
        genres={null}
        index={0}
        language="ru-RU"
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Тестовый сериал')).toBeDefined();
  });

  it('handles mouse enter and leave for hover effects', () => {
    render(
      <TVShowCard
        tvShow={mockTVShow}
        genres={mockGenres}
        index={0}
        language="ru-RU"
        onClick={mockOnClick}
      />
    );
    
    const card = document.querySelector('.tv-show-card');
    
    fireEvent.mouseEnter(card);
    expect(card).toBeDefined();
    
    fireEvent.mouseLeave(card);
    expect(card).toBeDefined();
  });
});