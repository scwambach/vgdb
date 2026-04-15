import { useRouter } from 'next/navigation';

export interface Platform {
  id: number;
  slug: string;
  name: string;
  color: string;
}

export function usePlatformCardLogic(platform: Platform) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/games/${platform.slug}`);
  };

  return {
    handleClick,
  };
}
