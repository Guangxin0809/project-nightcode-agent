import { EmptyBorder } from "../border";
import { useTheme } from "../../providers/theme";

export function UserMessage({ message }: { message: string }) {

  const { colors } = useTheme();

  return (
    <box alignItems="center" width="100%">
      <box
        width="100%"
        border={["left"]}
        borderColor={colors.primary}
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
          <text>{message}</text>
        </box>
      </box>
    </box>
  );

};