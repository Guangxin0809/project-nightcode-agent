import { useTheme } from "../../providers/theme";

type Props = {
  content: string;
  model: string;
}

export function BotMessage({ content, model }: Props) {

  const { colors } = useTheme();

  return (
    <box alignItems="center" width="100%">
      <box width="100%" paddingY={1}>
        <box width="100%" paddingX={3}>
          <text>{content}</text>
        </box>
      </box>

      <box gap={1} width="100%" paddingX={3} paddingBottom={1}>
        <box flexDirection="row" gap={2}>
          <text fg={colors.primary}>◉</text>
          <text>{model}</text>
        </box>
      </box>
    </box>
  );

};