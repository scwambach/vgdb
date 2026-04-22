import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameCard from "./index";
import { useGameCardLogic } from "./Logic";

jest.mock("./Logic");

const mockUseGameCardLogic = useGameCardLogic as jest.MockedFunction<
  typeof useGameCardLogic
>;

describe("GameCard", () => {
  const mockGame = {
    id: 1,
    name: "Super Mario Bros.",
    slug: "super-mario-bros",
    cover: {
      image_id: "co1234",
    },
    rating: 90,
  };

  const mockLogicReturn = {
    isFavorite: false,
    favLoading: false,
    handleFavoriteToggle: jest.fn(),
  };

  beforeEach(() => {
    mockUseGameCardLogic.mockReturnValue(mockLogicReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<GameCard game={mockGame} platformSlug="nes" />);
    expect(screen.getByText("Super Mario Bros.")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <GameCard game={mockGame} platformSlug="nes" />,
    );
    expect(container).toMatchSnapshot();
  });

  it("displays game name", () => {
    render(<GameCard game={mockGame} platformSlug="nes" />);
    expect(screen.getByText("Super Mario Bros.")).toBeInTheDocument();
  });

  it("displays rating when available", () => {
    render(<GameCard game={mockGame} platformSlug="nes" />);
    const rating = screen.getByRole("img", { hidden: true });
    expect(rating).toBeInTheDocument();
  });

  it("renders as a link to the game detail page", () => {
    render(<GameCard game={mockGame} platformSlug="nes" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/games/nes/super-mario-bros");
  });

  it("calls handleFavoriteToggle when favorite button is clicked", () => {
    render(<GameCard game={mockGame} platformSlug="nes" />);
    const favoriteButtons = screen.getAllByRole("button");
    const favoriteButton = favoriteButtons[1]; // First IconButton
    fireEvent.click(favoriteButton);
    expect(mockLogicReturn.handleFavoriteToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onAddToCollection when add button is clicked", () => {
    const mockAddToCollection = jest.fn();
    render(
      <GameCard
        game={mockGame}
        platformSlug="nes"
        onAddToCollection={mockAddToCollection}
      />,
    );
    const buttons = screen.getAllByRole("button");
    const addButton = buttons[2]; // Second IconButton
    fireEvent.click(addButton);
    expect(mockAddToCollection).toHaveBeenCalledWith(mockGame);
  });
});
