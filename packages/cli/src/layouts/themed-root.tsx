import type { ReactNode } from "react";

import { useTheme } from "../providers/theme";

export function ThemedRoot({ children }: { children: ReactNode }) {

  const { colors } = useTheme();

  return (
    <box
      flexGrow={1}
      width="100%"
      height="100%"
      backgroundColor={colors.background}
    >
      {children}
    </box>
  );

};