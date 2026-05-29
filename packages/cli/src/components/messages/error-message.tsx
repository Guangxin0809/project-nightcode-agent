import { TextAttributes } from "@opentui/core";

import { EmptyBorder } from "../border";
import { useTheme } from "../../providers/theme";

export function ErrorMessage({ message }: { message: string }) {

  const { colors } = useTheme();

  return (
    <box alignItems="center" width="100%">
      <box
        width="100%"
        border={["left"]}
        borderColor={colors.error}
        customBorderChars={{
          ...EmptyBorder,
          vertical: "┃",
          bottomLeft: "╹",
        }}
      >
        <box
          justifyContent="center"
          width="100%"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
        >
          <text attributes={TextAttributes.DIM}>{message}</text>
        </box>
      </box>
    </box>
  );

};