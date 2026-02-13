import { useBanners } from './useBanners';
import type { BannerItem } from '~/types/media';
import type { Ref } from 'vue';

/**
 * Hook to fetch media (banners) with proper typing.
 * It wraps the existing `useBanners` composable and reads the API URL from runtime config.
 */
export const useMediaHook = () => {
  // The existing composable expects an API URL string, but it internally reads the URL from runtime config.
  // Passing an empty string satisfies the signature.
  const { banners, isLoading, isError, refresh } = useBanners('');

  return {
    banners: banners as Ref<BannerItem[]>,
    isLoading,
    isError,
    refresh,
  };
};
