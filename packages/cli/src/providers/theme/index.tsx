import { join } from "node:path";
import { homedir } from "node:os";
import type { ReactNode } from "react";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createContext, useContext, useCallback, useState } from "react";

import { THEMES, DEFAILT_THEME } from "../../theme";
import type { ThemeColors, Theme } from "../../theme";

const CONFIG_DIR = join(homedir(), ".nightcode");
const THEME_PREFERENCES_PATH = join(CONFIG_DIR, "preferences.json");

type ThemePreferences = {
  themeName: string;
};

function getInitialTheme(): Theme {

  try {
    const preferences = JSON.parse(
      readFileSync(THEME_PREFERENCES_PATH, "utf8")
    ) as Partial<ThemePreferences>;
    const savedTheme = THEMES.find(
      theme => theme.name === preferences.themeName
    )
    return savedTheme ?? DEFAILT_THEME;
  } catch {
    return DEFAILT_THEME;
  }

};

function persistTheme(theme: Theme) {

  try {
    mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(
      THEME_PREFERENCES_PATH,
      JSON.stringify({ themeName: theme.name } satisfies ThemePreferences, null, 2),
      "utf8",
    );
  } catch {
    // Ignore preference write failures, so theme switching still works for this session.
  }

};

type ThemeContextValue = {
  colors: ThemeColors;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {

  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return value;

};

export function ThemeProvider({ children }: { children: ReactNode })  {

  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme);
    persistTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{
      colors: currentTheme.colors,
      currentTheme,
      setTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );

};