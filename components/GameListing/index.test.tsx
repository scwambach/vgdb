import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import GameListing from "./index";
import { useGameListingLogic } from "./Logic";

jest.mock("./Logic");
jest.mock("@/components/GameCard", () => ({
  __esModule: true,
  default: ({ game }: any) => <div data-testid="game-card">{game.name}</div>,
}));

const mockUseGameListingLogic = useGameListingLogic as jest.MockedFunction<
  typeof useGameListingLogic
>;

describe("GameListing", () => {
  const mockGames = [
    {
      id: 1,
      name: "Super Mario Bros.",
      slug: "super-mario-bros",
      cover: { image_id: "co1" },
      rating: 90,
    },
    {
      id: 2,
      name: "The Legend of Zelda",
      slug: "the-legend-of-zelda",
      cover: { image_id: "co2" },
      rating: 95,
    },
  ];

  const defaultLogicReturn = {
    games: mockGames,
    loading: false,
    error: null,
    filters: {},
    sortBy: "name" as const,
    sortDirection: "asc" as const,
    drawerOpen: false,
    hasMore: true,
    observerTarget: { current: null },
    handleFilterChange: jest.fn(),
    handleSortChange: jest.fn(),
    toggleDrawer: jest.fn(),
  };

  beforeEach(() => {
    mockUseGameListingLogic.mockReturnValue(defaultLogicReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<GameListing platformSlug="nes" platformName="NES" />);
    expect(screen.getByText("NES Games")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(
      <GameListing platformSlug="nes" platformName="NES" />,
    );
    expect(container).toMatchSnapshot();
  });

  it("displays game cards", () => {
    render(<GameListing platformSlug="nes" platformName="NES" />);
    expect(screen.getAllByTestId("game-card")).toHaveLength(2);
  });

  it("shows loading skeletons when loading", () => {
    mockUseGameListingLogic.mockReturnValue({
      ...defaultLogicReturn,
      games: [],
      loading: true,
    });
    const { container } = render(
      <GameListing platformSlug="nes" platformName="NES" />,
    );
    expect(container.querySelectorAll(".MuiSkeleton-root")).not.toHaveLength(0);
  });

  it("displays error message when error occurs", () => {
    mockUseGameListingLogic.mockReturnValue({
      ...defaultLogicReturn,
      error: "Failed to load games",
    });
    render(<GameListing platformSlug="nes" platformName="NES" />);
    expect(screen.getByText("Failed to load games")).toBeInTheDocument();
  });

  it("shows loading indicator when loading more games", () => {
    mockUseGameListingLogic.mockReturnValue({
      ...defaultLogicReturn,
      loading: true,
      hasMore: true,
    });
    const { container } = render(
      <GameListing platformSlug="nes" platformName="NES" />,
    );
    expect(
      container.querySelector(".MuiCircularProgress-root"),
    ).toBeInTheDocument();
  });

  it("calls toggleDrawer when filter button is clicked", () => {
    render(<GameListing platformSlug="nes" platformName="NES" />);
    const filterButton = screen.getByRole("button", { name: /filter/i });
    fireEvent.click(filterButton);
    expect(defaultLogicReturn.toggleDrawer).toHaveBeenCalledTimes(1);
  });
});
