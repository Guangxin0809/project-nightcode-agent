import { useKeyboard } from "@opentui/react"
import type { ScrollBoxRenderable } from "@opentui/core";
import { useRef, useState, useMemo, type RefObject } from "react";

import type { Command } from "./types";
import { getFilteredCommands } from "./filter-commands";
import { useKeyboardLayer } from "../../providers/keyboard-layer";

type UseCommandMenuReturn = {
  showCommandMenu: boolean;
  commandQuery: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  resolveCommand: (index: number) => Command | undefined;
  handleContentChange: (text: string) => void;
  setSelectedIndex: (index: number) => void;
};

export function useCommandMenu(): UseCommandMenuReturn {

  const [textValue, setTextValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollRef = useRef<ScrollBoxRenderable>(null);
  const { push, pop, isTopLayer } = useKeyboardLayer();

  const commandQuery = showCommandMenu && textValue.startsWith("/")
    ? textValue.slice(1)
    : "";

  const filteredCommands = useMemo(() => getFilteredCommands(commandQuery), [commandQuery]);

  const closeCommandMenu = () => {
    setShowCommandMenu(false);
    pop("command");
  };

  const handleContentChange = (text: string) => {
    setTextValue(text);
    setSelectedIndex(0);

    // Jump back to the top of the list when the user types a new character
    const scrollbox = scrollRef.current;
    if (scrollbox) {
      scrollbox.scrollTo(0);
    };

    const prefix = text.startsWith("/") ? text.slice(1) : null;
    if ((prefix !== null) && !prefix.includes(" ")) {
      setShowCommandMenu(true);
      push("command", () => {
        closeCommandMenu();
        return true;
      });
    } else {
      closeCommandMenu();
    };
  };

  // Resolve a command at a specific index (returns the command, caller handles execution)
  const resolveCommand = (index: number): Command | undefined => {
    const command = filteredCommands[index];
    if (command) {
      closeCommandMenu();
    }
    return command;
  };

  // Arrow keys move selection, the list follows along when the highlight goes off-screen
  useKeyboard((key) => {

    if (!showCommandMenu || !isTopLayer("command")) return;

    if (key.name === "escape") {
      key.preventDefault();
      closeCommandMenu();
    } else if (key.name === "up") {
      key.preventDefault();
      setSelectedIndex((index: number) => {
        const newIndex = Math.max(0, index - 1);
        // Keep the highlighted item visible when arrowing past the edge
        const scrollBar = scrollRef.current;
        if (scrollBar && (newIndex < scrollBar.scrollTop)) {
          scrollBar.scrollTo(newIndex);
        }
        return newIndex;
      });
    } else if (key.name === "down") {
      key.preventDefault();
      setSelectedIndex((index: number) => {

        if (filteredCommands.length === 0) {
          return 0;
        }

        const newIndex = Math.min(filteredCommands.length - 1, index + 1);
        const scrollBar = scrollRef.current;
        if (scrollBar) {
          const viewportHeight = scrollBar.viewport.height;
          const visibleEnd = scrollBar.scrollTop + viewportHeight - 1;
          if (newIndex > visibleEnd) {
            scrollBar.scrollTo(newIndex - viewportHeight + 1);
          }
        }

        return newIndex;
      });
    }

  });

  return {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex,
  };

};