import { CAMPERS_API_BASE_URL, CAMPERS_PER_PAGE_LIMIT } from "@/constants/environment";
import { CamperListResponseDto, CatalogFiltersState } from "@/types/campers";

interface FetchCampersArguments {
  pageParam?: number;
  filters?: CatalogFiltersState;
}

export const fetchCampersFromExternalService = async ({
  pageParam = 1,
  filters,
}: FetchCampersArguments): Promise<CamperListResponseDto> => {
  const urlSearchParamsInstance = new URLSearchParams();

  urlSearchParamsInstance.append("page", pageParam.toString());
  urlSearchParamsInstance.append("perPage", CAMPERS_PER_PAGE_LIMIT.toString());

  if (filters) {
    if (filters.location.trim() !== "") {
      urlSearchParamsInstance.append("location", filters.location.trim());
    }
    if (filters.form !== "") {
      urlSearchParamsInstance.append("form", filters.form);
    }
    if (filters.transmission !== "") {
      urlSearchParamsInstance.append("transmission", filters.transmission);
    }
    if (filters.engine !== "") {
      urlSearchParamsInstance.append("engine", filters.engine);
    }
  }

  const targetRequestUrlString = `${CAMPERS_API_BASE_URL}/campers?${urlSearchParamsInstance.toString()}`;
  const serviceFetchResponseInstance = await fetch(targetRequestUrlString);

  if (!serviceFetchResponseInstance.ok) {
    throw new Error(
      `Failed to fetch campers from service. Status: ${serviceFetchResponseInstance.status}`,
    );
  }

  const targetFormattedDataResponse: CamperListResponseDto =
    await serviceFetchResponseInstance.json();

  return targetFormattedDataResponse;
};

export const fetchAvailableLocationsFromBackend = async (): Promise<string[]> => {
  const uniqueLocationsSet = new Set<string>();
  let currentPage = 1;
  let totalPages = 1;

  while (currentPage <= totalPages) {
    const urlSearchParamsInstance = new URLSearchParams({
      page: currentPage.toString(),
      perPage: CAMPERS_PER_PAGE_LIMIT.toString(),
    });

    const targetRequestUrlString = `${CAMPERS_API_BASE_URL}/campers?${urlSearchParamsInstance.toString()}`;
    const serviceFetchResponseInstance = await fetch(targetRequestUrlString);

    if (!serviceFetchResponseInstance.ok) {
      break;
    }

    const targetFormattedDataResponse: CamperListResponseDto =
      await serviceFetchResponseInstance.json();

    totalPages = targetFormattedDataResponse.totalPages || 1;

    targetFormattedDataResponse.campers.forEach((camperItem) => {
      const trimmedLocation = camperItem.location.trim();
      if (trimmedLocation !== "") {
        uniqueLocationsSet.add(trimmedLocation);
      }
    });

    currentPage += 1;
  }

  return Array.from(uniqueLocationsSet).sort((firstLocation, secondLocation) =>
    firstLocation.localeCompare(secondLocation),
  );
};
