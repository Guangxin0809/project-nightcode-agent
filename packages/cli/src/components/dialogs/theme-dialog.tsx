import { useCallback, useEffect, useRef } from "react";

import { THEMES } from "../../theme";
import type { Theme } from "../../theme";
import { useTheme } from "../../providers/theme";
import { useDialog } from "../../providers/dialog";
import { DialogSearchList } from "../dialog-search-list";

export const ThemeDialogContent = () => {

  const dialog = useDialog();
  const { currentTheme, setTheme } = useTheme();
  const originalThemeRef = useRef(currentTheme);
  const confirmRef = useRef(false);

  // Revert to original theme if the user dismisses without confirming
  useEffect(() => {
    return () => {
      if (!confirmRef.current) {
        setTheme(originalThemeRef.current);
      }
    };
  }, [setTheme]);

  const handleSelect = useCallback((theme: Theme) => {
    confirmRef.current = true;
    setTheme(theme);
    dialog.close();
  }, [setTheme, dialog]);

  const handleHighlight = useCallback((theme: Theme) => {
    setTheme(theme);
  }, [setTheme]);

  return (
    <DialogSearchList
      items={THEMES}
      onSelect={handleSelect}
      onHighlight={handleHighlight}
      filterFn={
        (t, query) => t.name.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={
        (theme, isSelected) => (
          <text selectable={false} fg={isSelected ? "black" : "white"}>
            {theme.name === originalThemeRef.current.name
              ? "\u0020\u2022\u0020"
              : "\u0020\u0020\u0020"}
            {theme.name}
          </text>
        )
      }
      getKey={t => t.name}
      placeholder="Search themes"
      emptyText="No matching themes"
    />
  );

};