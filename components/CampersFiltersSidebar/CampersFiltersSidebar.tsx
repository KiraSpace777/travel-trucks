"use client";

import React, { useState, useRef, useEffect, type SubmitEvent } from "react";
import {
  CatalogFiltersState,
  CamperBodyFormType,
  CamperEngineType,
  CamperTransmissionType,
} from "@/types/campers";
import styles from "./CampersFiltersSidebar.module.css";

interface CampersFiltersSidebarProperties {
  activeFiltersValueObject: CatalogFiltersState;
  availableLocationsList: string[];
  onApplyFilters: (newFiltersState: CatalogFiltersState) => void;
}

const INITIAL_LOCAL_FILTERS: CatalogFiltersState = {
  location: "",
  form: "",
  transmission: "",
  engine: "",
};

const NON_ENGLISH_CHARACTERS_REGEX = /[^a-zA-Z0-9\s,.-]/g;

const formatLocationCityFirst = (rawLocation: string): string => {
  const parts = rawLocation
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 2) {
    return `${parts[1]}, ${parts[0]}`;
  }

  return rawLocation;
};

export const CampersFiltersSidebar = ({
  activeFiltersValueObject,
  availableLocationsList,
  onApplyFilters,
}: CampersFiltersSidebarProperties) => {
  const [localFiltersState, setLocalFiltersState] = useState<CatalogFiltersState>(() => ({
    ...(activeFiltersValueObject || INITIAL_LOCAL_FILTERS),
    location: formatLocationCityFirst(activeFiltersValueObject?.location || ""),
  }));
  const [isLocationsDropdownOpen, setIsLocationsDropdownOpen] = useState<boolean>(false);
  const [isNonEnglishAttempted, setIsNonEnglishAttempted] = useState<boolean>(false);
  const locationBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (eventInstance: MouseEvent) => {
      if (
        locationBlockRef.current &&
        !locationBlockRef.current.contains(eventInstance.target as Node)
      ) {
        setIsLocationsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const normalizedQuery = localFiltersState.location.trim().toLowerCase();

  const filteredLocationsOptions = availableLocationsList
    .filter((locationOption) => {
      if (normalizedQuery === "") {
        return true;
      }

      const formattedOption = formatLocationCityFirst(locationOption).toLowerCase();
      const locationParts = formattedOption.split(",").map((part) => part.trim());

      return (
        formattedOption.startsWith(normalizedQuery) ||
        locationOption.toLowerCase().startsWith(normalizedQuery) ||
        locationParts.some((part) => part.startsWith(normalizedQuery))
      );
    })
    .sort((firstLocation, secondLocation) =>
      formatLocationCityFirst(firstLocation).localeCompare(formatLocationCityFirst(secondLocation)),
    );

  const resolveSearchLocationValue = (rawLocation: string): string => {
    const trimmedValue = rawLocation.trim();
    if (trimmedValue === "") {
      return "";
    }

    const exactMatch = availableLocationsList.find(
      (locationOption) =>
        locationOption.toLowerCase() === trimmedValue.toLowerCase() ||
        formatLocationCityFirst(locationOption).toLowerCase() === trimmedValue.toLowerCase(),
    );
    if (exactMatch) {
      return exactMatch;
    }

    if (filteredLocationsOptions.length === 1) {
      return filteredLocationsOptions[0];
    }

    const cityOrCountryPrefixMatch = filteredLocationsOptions.find((locationOption) => {
      const formattedParts = formatLocationCityFirst(locationOption)
        .toLowerCase()
        .split(",")
        .map((part) => part.trim());
      return formattedParts.some((part) => part.startsWith(trimmedValue.toLowerCase()));
    });

    return cityOrCountryPrefixMatch || trimmedValue;
  };

  const applyResolvedFilters = (draftFilters: CatalogFiltersState) => {
    const backendLocationValue = resolveSearchLocationValue(draftFilters.location);
    const displayLocationValue = formatLocationCityFirst(backendLocationValue);

    setLocalFiltersState({
      ...draftFilters,
      location: displayLocationValue,
    });
    setIsLocationsDropdownOpen(false);
    onApplyFilters({
      ...draftFilters,
      location: backendLocationValue,
    });
  };

  const handleLocationChange = (eventInstance: React.ChangeEvent<HTMLInputElement>) => {
    const rawInputValue = eventInstance.target.value;
    const hasInvalidCharacters = NON_ENGLISH_CHARACTERS_REGEX.test(rawInputValue);
    const sanitizedEnglishValue = rawInputValue.replace(NON_ENGLISH_CHARACTERS_REGEX, "");

    setIsNonEnglishAttempted(hasInvalidCharacters);
    setLocalFiltersState((previousState) => ({
      ...previousState,
      location: sanitizedEnglishValue,
    }));
    setIsLocationsDropdownOpen(true);
  };

  const handleLocationKeyDown = (eventInstance: React.KeyboardEvent<HTMLInputElement>) => {
    if (eventInstance.key === "Enter") {
      eventInstance.preventDefault();
      applyResolvedFilters(localFiltersState);
    }
  };

  const handleSelectLocationFromDropdown = (selectedBackendLocation: string) => {
    setIsNonEnglishAttempted(false);
    const displayLocationValue = formatLocationCityFirst(selectedBackendLocation);

    setLocalFiltersState((previousState) => ({
      ...previousState,
      location: displayLocationValue,
    }));
    setIsLocationsDropdownOpen(false);
    onApplyFilters({
      ...localFiltersState,
      location: selectedBackendLocation,
    });
  };

  const handleFormChange = (formValue: CamperBodyFormType) => {
    setLocalFiltersState((previousState) => ({
      ...previousState,
      form: formValue,
    }));
  };

  const handleEngineChange = (engineValue: CamperEngineType) => {
    setLocalFiltersState((previousState) => ({
      ...previousState,
      engine: engineValue,
    }));
  };

  const handleTransmissionChange = (transmissionValue: CamperTransmissionType) => {
    setLocalFiltersState((previousState) => ({
      ...previousState,
      transmission: transmissionValue,
    }));
  };

  const handleSearchSubmit = (eventInstance: SubmitEvent<HTMLFormElement>) => {
    eventInstance.preventDefault();
    applyResolvedFilters(localFiltersState);
  };

  const handleClearFiltersClick = () => {
    setIsNonEnglishAttempted(false);
    setIsLocationsDropdownOpen(false);
    setLocalFiltersState(INITIAL_LOCAL_FILTERS);
    onApplyFilters(INITIAL_LOCAL_FILTERS);
  };

  return (
    <div className={styles.sidebarWrapperContainer}>
      <form onSubmit={handleSearchSubmit} className={styles.filtersForm}>
        <div className={styles.locationBlock} ref={locationBlockRef}>
          <label htmlFor="locationInputId" className={`${styles.locationLabel} interRegular`}>
            Location
          </label>
          <div className={styles.inputWrapper}>
            <svg className={styles.locationIcon}>
              <use href="/sprite.svg#icon-map" />
            </svg>
            <input
              id="locationInputId"
              type="text"
              lang="en"
              autoComplete="off"
              placeholder="Kyiv, Ukraine"
              value={localFiltersState.location}
              onFocus={() => setIsLocationsDropdownOpen(true)}
              onChange={handleLocationChange}
              onKeyDown={handleLocationKeyDown}
              className={`${styles.locationInput} interRegular`}
            />
          </div>
          <span
            className={`${styles.locationHintText} ${
              isNonEnglishAttempted ? styles.locationHintWarning : ""
            } interRegular`}
          >
            {isNonEnglishAttempted
              ? "Please use English letters only (e.g., Kyiv, Ukraine)"
              : "Enter location in English or choose from the list"}
          </span>

          {isLocationsDropdownOpen && filteredLocationsOptions.length > 0 && (
            <ul className={styles.locationsDropdownList}>
              {filteredLocationsOptions.map((locationOption) => (
                <li key={locationOption} className={styles.locationDropdownItem}>
                  <button
                    type="button"
                    className={`${styles.locationDropdownButton} interRegular`}
                    onClick={() => handleSelectLocationFromDropdown(locationOption)}
                  >
                    {formatLocationCityFirst(locationOption)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <h2 className={`${styles.filtersTitle} interSemiBold`}>Filters</h2>

        <section className={styles.filterSection}>
          <h3 className={`${styles.sectionHeading} interMedium`}>Camper form</h3>
          <ul className={styles.optionsList}>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="formGroup"
                  checked={localFiltersState.form === "alcove"}
                  onChange={() => handleFormChange("alcove")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Alcove</span>
              </label>
            </li>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="formGroup"
                  checked={localFiltersState.form === "panel_van"}
                  onChange={() => handleFormChange("panel_van")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Panel Van</span>
              </label>
            </li>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="formGroup"
                  checked={localFiltersState.form === "integrated"}
                  onChange={() => handleFormChange("integrated")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Integrated</span>
              </label>
            </li>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="formGroup"
                  checked={localFiltersState.form === "semi_integrated"}
                  onChange={() => handleFormChange("semi_integrated")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Semi Integrated</span>
              </label>
            </li>
          </ul>
        </section>

        <section className={styles.filterSection}>
          <h3 className={`${styles.sectionHeading} interMedium`}>Engine</h3>
          <ul className={styles.optionsList}>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="engineGroup"
                  checked={localFiltersState.engine === "diesel"}
                  onChange={() => handleEngineChange("diesel")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Diesel</span>
              </label>
            </li>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="engineGroup"
                  checked={localFiltersState.engine === "petrol"}
                  onChange={() => handleEngineChange("petrol")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Petrol</span>
              </label>
            </li>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="engineGroup"
                  checked={localFiltersState.engine === "hybrid"}
                  onChange={() => handleEngineChange("hybrid")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Hybrid</span>
              </label>
            </li>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="engineGroup"
                  checked={localFiltersState.engine === "electric"}
                  onChange={() => handleEngineChange("electric")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Electric</span>
              </label>
            </li>
          </ul>
        </section>

        <section className={styles.filterSection}>
          <h3 className={`${styles.sectionHeading} interMedium`}>Transmission</h3>
          <ul className={styles.optionsList}>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="transmissionGroup"
                  checked={localFiltersState.transmission === "automatic"}
                  onChange={() => handleTransmissionChange("automatic")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Automatic</span>
              </label>
            </li>
            <li>
              <label className={styles.radioOptionItem}>
                <input
                  type="radio"
                  name="transmissionGroup"
                  checked={localFiltersState.transmission === "manual"}
                  onChange={() => handleTransmissionChange("manual")}
                  className={styles.nativeRadioInput}
                />
                <span className={`${styles.optionTextLabel} interRegular`}>Manual</span>
              </label>
            </li>
          </ul>
        </section>

        <div className={styles.actionsBlock}>
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
          <button type="button" onClick={handleClearFiltersClick} className={styles.clearButton}>
            <svg className={styles.clearFiltersIconCross}>
              <use href="/sprite.svg#icon-close" />
            </svg>
            <span className={`${styles.clearFiltersButtonText} interMedium`}>Clear filters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
