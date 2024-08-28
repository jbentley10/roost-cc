/**
 * @file locale-provider.ts
 */

import React, { createContext, useContext } from "react";

// Define an interface for the context value
interface LocaleContextType {
  isEnglish: boolean;
  setIsEnglish: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with the appropriate type
export const LocaleContext = createContext<LocaleContextType | undefined>(
  undefined
);

// Create a custom hook to use the LocaleContext
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
