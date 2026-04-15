import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlatformCard from './index';
import { usePlatformCardLogic } from './Logic';

jest.mock('./Logic');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockUsePlatformCardLogic = usePlatformCardLogic as jest.MockedFunction<
  typeof usePlatformCardLogic
>;

describe('PlatformCard', () => {
  const mockPlatform = {
    id: 18,
    slug: 'nes',
    name: 'NES',
    color: '#E32636',
  };

  const mockHandleClick = jest.fn();

  beforeEach(() => {
    mockUsePlatformCardLogic.mockReturnValue({
      handleClick: mockHandleClick,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PlatformCard platform={mockPlatform} />);
    expect(screen.getAllByText('NES')).toHaveLength(2); // Header and content
  });

  it('matches snapshot', () => {
    const { container } = render(<PlatformCard platform={mockPlatform} />);
    expect(container).toMatchSnapshot();
  });

  it('displays platform name', () => {
    render(<PlatformCard platform={mockPlatform} />);
    expect(screen.getAllByText('NES')[0]).toBeInTheDocument();
  });

  it('calls handleClick when card is clicked', () => {
    render(<PlatformCard platform={mockPlatform} />);
    const card = screen.getByRole('button');
    fireEvent.click(card);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it('applies platform color to header', () => {
    const { container } = render(<PlatformCard platform={mockPlatform} />);
    const colorBox = container.querySelector('[style*="background-color"]');
    expect(colorBox).toBeInTheDocument();
  });
});
