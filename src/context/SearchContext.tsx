import React, { createContext, useContext, useState } from "react";
import { GalleryPhoto } from "../api/api";

interface SearchContextProps {
  searchHistory: string[];
  addSearchTerm: (term: string) => void;
  cache: Record<string, GalleryPhoto[]>;
  updateCache: (term: string, photos: GalleryPhoto[]) => void;
}

const SearchContext = createContext<SearchContextProps>(
  {} as SearchContextProps
);

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [cache, setCache] = useState<Record<string, GalleryPhoto[]>>({});

  const addSearchTerm = (term: string) => {
    setSearchHistory((prev) => (prev.includes(term) ? prev : [term, ...prev]));
  };

  const updateCache = (term: string, photos: GalleryPhoto[]) => {
    setCache((prev) => ({ ...prev, [term]: photos }));
  };

  return (
    <SearchContext.Provider
      value={{ searchHistory, addSearchTerm, cache, updateCache }}
    >
      {children}
    </SearchContext.Provider>
  );
};
