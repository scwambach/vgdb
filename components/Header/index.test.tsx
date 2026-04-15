import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "./index";
import { useHeaderLogic } from "./Logic";

// Mock the Logic module
jest.mock("./Logic");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockUseHeaderLogic = useHeaderLogic as jest.MockedFunction<
  typeof useHeaderLogic
>;

describe("Header", () => {
  const defaultLogicReturn = {
    mode: "light" as const,
    toggleTheme: jest.fn(),
    searchQuery: "",
    searchResults: [],
    searchLoading: false,
    anchorEl: null,
    handleSearchChange: jest.fn(),
    handleSearchSelect: jest.fn(),
    handleSearchKeyDown: jest.fn(),
    handleRandomGame: jest.fn(),
    handleMenuOpen: jest.fn(),
    handleMenuClose: jest.fn(),
    handleNavigation: jest.fn(),
  };

  beforeEach(() => {
    mockUseHeaderLogic.mockReturnValue(defaultLogicReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<Header />);
    expect(screen.getByText("RetroVault")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  it("displays login button when no user is provided", () => {
    render(<Header />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("displays user avatar when user is logged in", () => {
    const user = {
      id: "1",
      username: "testuser",
      avatar_url: "https://example.com/avatar.jpg",
    };
    render(<Header user={user} />);
    expect(screen.getByAltText("testuser")).toBeInTheDocument();
  });

  it("renders search field with placeholder", () => {
    render(<Header />);
    expect(
      screen.getByPlaceholderText(/Search games and platforms/i),
    ).toBeInTheDocument();
  });

  it("calls handleSearchKeyDown when Enter is pressed in search field", () => {
    render(<Header />);
    const searchField = screen.getByPlaceholderText(
      /Search games and platforms/i,
    );
    fireEvent.keyDown(searchField, { key: "Enter", code: "Enter" });
    expect(defaultLogicReturn.handleSearchKeyDown).toHaveBeenCalled();
  });

  it("calls handleSearchSelect when a dropdown item is clicked", () => {
    mockUseHeaderLogic.mockReturnValue({
      ...defaultLogicReturn,
      searchResults: [
        {
          id: 1,
          name: "Test Game",
          slug: "test-game",
          type: "game",
          platformSlug: "nes",
        },
      ],
    });
    render(<Header />);
    // Selecting from autocomplete will trigger handleSearchSelect
  });

  it("calls handleRandomGame when random button is clicked", () => {
    render(<Header />);
    const randomButton = screen.getByTitle("Random Game");
    fireEvent.click(randomButton);
    expect(defaultLogicReturn.handleRandomGame).toHaveBeenCalledTimes(1);
  });

  it("calls toggleTheme when theme toggle is clicked", () => {
    render(<Header />);
    const themeButton = screen.getByTitle("Toggle Theme");
    fireEvent.click(themeButton);
    expect(defaultLogicReturn.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it("opens user menu when avatar is clicked", () => {
    const user = {
      id: "1",
      username: "testuser",
    };
    render(<Header user={user} />);
    const avatar = screen.getByText("T"); // First letter of username
    fireEvent.click(avatar);
    expect(defaultLogicReturn.handleMenuOpen).toHaveBeenCalledTimes(1);
  });
});
