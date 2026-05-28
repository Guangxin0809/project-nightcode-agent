import type { RefObject } from "react";
import { TextAttributes, type ScrollBoxRenderable } from "@opentui/core";

import { COMMANDS } from "./commands";
import { useTheme } from "../../providers/theme";
import { getFilteredCommands } from "./filter-commands";

type CommandProps = {
  query: string;
  selectedIndex: number;
  scrollRef: RefObject<ScrollBoxRenderable | null>;
  onSelect: (index: number) => void;
  onExecute: (index: number) => void;
};

const MAX_VISIABLE_ITEMS = 8;
const COMMAND_COL_WIDTH = Math.max(...COMMANDS.map(cmd => cmd.name.length)) + 4;

export function CommandMenu({
  query,
  selectedIndex,
  scrollRef,
  onSelect,
  onExecute,
}: CommandProps) {

  const { colors } = useTheme();
  const filtered = getFilteredCommands(query);
  const visiableHeight = Math.min(filtered.length, MAX_VISIABLE_ITEMS);

  if (filtered.length === 0) {
    return (
      <box paddingX={1}>
        <text attributes={TextAttributes.DIM}>
          No matching commands
        </text>
      </box>
    );
  }

  return (
    <scrollbox ref={scrollRef} height={visiableHeight}>
      {filtered.map((command, index) => {

        const isSelected = index === selectedIndex;

        return (
          <box
            key={command.value}
            flexDirection="row"
            height={1}
            backgroundColor={isSelected ? colors.selection : undefined}
            overflow="hidden"
            onMouseMove={() => onSelect(index)}
            onMouseDown={() => onSelect(index)}
          >
            <box flexShrink={0} width={COMMAND_COL_WIDTH}>
              <text selectable={false} fg={isSelected ? "black" : "white"}>
                /{command.name}
              </text>
            </box>
            <box flexGrow={1} flexShrink={1} overflow="hidden">
              <text selectable={false} fg={isSelected ? "black" : "gray"}>
                {command.description}
              </text>
            </box>
          </box>
        );

      })}
    </scrollbox>
  );

};