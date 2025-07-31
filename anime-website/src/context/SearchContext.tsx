import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Create the context with a default value
// The '!' is a non-null assertion, telling TypeScript we know this will be provided.
const SearchContext = createContext<SearchContextType>(null!);

// Custom hook for easy consumption of the context
export const useSearch = () => {
  return useContext(SearchContext);
};

// Define the props for the provider
interface SearchProviderProps {
  children: ReactNode;
}

// Create the provider component
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>('one piece'); // Default search query

  const value = {
    searchQuery,
    setSearchQuery,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
