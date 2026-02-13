import { useOffers } from './useOffers';
import type { Offer } from '~/types/offers';
import type { Ref } from 'vue';

/**
 * Hook to fetch offers with full TypeScript typing.
 * It internally reuses the existing `useOffers` composable for data fetching
 * and provides a simple `refresh` method.
 */
export const useOffersHook = () => {
  const {
    offers,
    loading,
    error,
    fetchAllOffers,
    offersByType,
    getOffersByType,
    featuredOffers,
    offersWithProducts,
    availableOfferTypes,
  } = useOffers();

  const refresh = async () => {
    await fetchAllOffers();
  };

  return {
    offers: offers as Ref<Offer[]>,
    loading,
    error,
    refresh,
    offersByType,
    getOffersByType,
    featuredOffers,
    offersWithProducts,
    availableOfferTypes,
  };
};
