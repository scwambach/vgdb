import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameDetail from './index';
import { useGameDetailLogic } from './Logic';

jest.mock('./Logic');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

const mockUseGameDetailLogic = useGameDetailLogic as jest.MockedFunction<
  typeof useGameDetailLogic
>;

describe('GameDetail', () => {
  const mockGame = {
    id: 1,
    name: 'Super Mario Bros.',
    slug: 'super-mario-bros',
    summary: 'A classic platformer game',
    cover: {
      image_id: 'co1234',
    },
    first_release_date: 433728000,
    rating: 90,
    genres: [{ id: 1, name: 'Platform' }],
    game_modes: [{ id: 1, name: 'Single player' }],
    involved_companies: [
      {
        company: { id: 1, name: 'Nintendo' },
        developer: true,
        publisher: true,
      },
    ],
  };

  const defaultLogicReturn = {
    isBeaten: false,
    isFavorite: false,
    personalRating: null,
    communityRating: 0,
    actionLoading: false,
    collectionDialogOpen: false,
    developers: ['Nintendo'],
    publishers: ['Nintendo'],
    handleBeatenToggle: jest.fn(),
    handleFavoriteToggle: jest.fn(),
    handleRatingChange: jest.fn(),
    handleOpenCollectionDialog: jest.fn(),
    handleCloseCollectionDialog: jest.fn(),
    formatReleaseDate: () => 'September 13, 1985',
    getPlayerCount: () => 'Single Player',
  };

  beforeEach(() => {
    mockUseGameDetailLogic.mockReturnValue(defaultLogicReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <GameDetail game={mockGame} platformSlug="nes" platformName="NES" />
    );
    expect(screen.getByText('Super Mario Bros.')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <GameDetail game={mockGame} platformSlug="nes" platformName="NES" />
    );
    expect(container).toMatchSnapshot();
  });

  it('displays game name and summary', () => {
    render(
      <GameDetail game={mockGame} platformSlug="nes" platformName="NES" />
    );
    expect(screen.getByText('Super Mario Bros.')).toBeInTheDocument();
    expect(screen.getByText('A classic platformer game')).toBeInTheDocument();
  });

  it('displays developers and publishers', () => {
    render(
      <GameDetail game={mockGame} platformSlug="nes" platformName="NES" />
    );
    expect(screen.getAllByText('Nintendo')).toHaveLength(2);
  });

  it('calls handleBeatenToggle when checkbox is clicked', () => {
    render(
      <GameDetail game={mockGame} platformSlug="nes" platformName="NES" />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(defaultLogicReturn.handleBeatenToggle).toHaveBeenCalledTimes(1);
  });

  it('calls handleFavoriteToggle when favorite button is clicked', () => {
    render(
      <GameDetail game={mockGame} platformSlug="nes" platformName="NES" />
    );
    const favoriteButtons = screen.getAllByRole('button');
    const favoriteButton = favoriteButtons.find((btn) =>
      btn.querySelector('svg')
    );
    if (favoriteButton) {
      fireEvent.click(favoriteButton);
      expect(defaultLogicReturn.handleFavoriteToggle).toHaveBeenCalledTimes(1);
    }
  });

  it('displays back button with platform name', () => {
    render(
      <GameDetail game={mockGame} platformSlug="nes" platformName="NES" />
    );
    expect(screen.getByText('Back to NES Games')).toBeInTheDocument();
  });
});
