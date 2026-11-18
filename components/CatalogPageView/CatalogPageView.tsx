"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { FaArrowUp } from "react-icons/fa";
import {
  fetchCampersFromExternalService,
  fetchAvailableLocationsFromBackend,
} from "@/utils/fetchCampersApi";
import { CampersFiltersSidebar } from "@/components/CampersFiltersSidebar/CampersFiltersSidebar";
import { CamperCard } from "@/components/CamperCard/CamperCard";
import { CatalogLoader } from "@/components/CatalogLoader/CatalogLoader";
import { CampersNotFound } from "@/components/CampersNotFound/CampersNotFound";
import { CatalogFiltersState, CamperListItemDto } from "@/types/campers";
import styles from "./CatalogPageView.module.css";

const INITIAL_FILTERS_STATE: CatalogFiltersState = {
  location: "",
  form: "",
  transmission: "",
  engine: "",
};

export const CatalogPageView = () => {
  const [activeCatalogFilters, setActiveCatalogFilters] =
    useState<CatalogFiltersState>(INITIAL_FILTERS_STATE);
  const [isScrollTopButtonVisible, setIsScrollTopButtonVisible] = useState<boolean>(false);

  const { data: availableLocationsList = [] } = useQuery({
    queryKey: ["campers-locations"],
    queryFn: fetchAvailableLocationsFromBackend,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: infiniteCampersPaginationData,
    fetchNextPage: fetchNextPageWithAdditionalCampers,
    hasNextPage: hasMoreCampersPagesToLoad,
    isFetchingNextPage: isCurrentlyLoadingMoreCampers,
    isLoading: isInitialCampersLoadingActive,
    isFetching: isAnyNetworkRequestFetchingActive,
  } = useInfiniteQuery({
    queryKey: ["campers", activeCatalogFilters],
    queryFn: ({ pageParam = 1 }) =>
      fetchCampersFromExternalService({ pageParam, filters: activeCatalogFilters }),
    initialPageParam: 1,
    getNextPageParam: (lastPageResponseDto) => {
      const currentLoadedPage = lastPageResponseDto.page;
      const totalAvailablePages = lastPageResponseDto.totalPages;
      return currentLoadedPage < totalAvailablePages ? currentLoadedPage + 1 : undefined;
    },
  });

  const allRenderedCampersFlattenedArray = infiniteCampersPaginationData
    ? infiniteCampersPaginationData.pages.flatMap((pageDto) => pageDto.campers)
    : [];

  useEffect(() => {
    const updateScrollButtonVisibility = () => {
      const isContentTallerThanViewport =
        document.documentElement.scrollHeight > window.innerHeight;
      const isScrolledDownEnough = window.scrollY > 300;
      setIsScrollTopButtonVisible(isContentTallerThanViewport && isScrolledDownEnough);
    };

    updateScrollButtonVisibility();
    window.addEventListener("scroll", updateScrollButtonVisibility, { passive: true });
    window.addEventListener("resize", updateScrollButtonVisibility);

    return () => {
      window.removeEventListener("scroll", updateScrollButtonVisibility);
      window.removeEventListener("resize", updateScrollButtonVisibility);
    };
  }, [allRenderedCampersFlattenedArray.length]);

  const handleApplyFiltersAction = (newFiltersState: CatalogFiltersState) => {
    setActiveCatalogFilters(newFiltersState);
  };

  const handleResetAllFiltersAction = () => {
    setActiveCatalogFilters(INITIAL_FILTERS_STATE);
  };

  const handleScrollToTopClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isCatalogListEmptyBoolean =
    !isInitialCampersLoadingActive && allRenderedCampersFlattenedArray.length === 0;

  return (
    <div className={styles.catalogPageContainer}>
      <div className={styles.catalogPageContent}>
        <aside className={styles.sidebarColumn}>
          <CampersFiltersSidebar
            key={`${activeCatalogFilters.location}-${activeCatalogFilters.form}-${activeCatalogFilters.engine}-${activeCatalogFilters.transmission}`}
            activeFiltersValueObject={activeCatalogFilters}
            availableLocationsList={availableLocationsList}
            onApplyFilters={handleApplyFiltersAction}
          />
        </aside>

        <section className={styles.catalogMainContentColumn}>
          <CatalogLoader isGlobalFetchingActive={isAnyNetworkRequestFetchingActive} />

          <CampersNotFound
            isCampersNotFoundActive={isCatalogListEmptyBoolean}
            onResetFiltersAction={handleResetAllFiltersAction}
          />

          {allRenderedCampersFlattenedArray.length > 0 && (
            <>
              <ul className={styles.campersListGrid}>
                {allRenderedCampersFlattenedArray.map(
                  (individualCamperItem: CamperListItemDto, arrayIndexInteger: number) => (
                    <li key={individualCamperItem.id} className={styles.camperListItem}>
                      <CamperCard
                        camperData={individualCamperItem}
                        isFirstCardElementInList={arrayIndexInteger === 0}
                      />
                    </li>
                  ),
                )}
              </ul>

              {hasMoreCampersPagesToLoad && (
                <button
                  type="button"
                  onClick={() => fetchNextPageWithAdditionalCampers()}
                  disabled={isCurrentlyLoadingMoreCampers}
                  className={`${styles.loadMoreButton} button interMedium`}
                >
                  {isCurrentlyLoadingMoreCampers ? "Loading..." : "Load more"}
                </button>
              )}
            </>
          )}
        </section>
      </div>

      {isScrollTopButtonVisible && (
        <button
          type="button"
          onClick={handleScrollToTopClick}
          className={styles.scrollToTopButton}
          aria-label="Scroll to top"
        >
          <FaArrowUp className={styles.scrollToTopIcon} />
        </button>
      )}
    </div>
  );
};
