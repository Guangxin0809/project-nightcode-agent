import { createRoot } from "@opentui/react";
import { createCliRenderer } from "@opentui/core";

import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";
import { ToastProvider } from "./providers/toast";
import { DialogProvider } from "./providers/dialog";
import { ThemeProvider, useTheme } from "./providers/theme";
import { KeyboardLayerProvider } from "./providers/keyboard-layer";

function ThemeRoot() {

  const { colors } = useTheme();

  return (
    <box
      justifyContent="center"
      alignItems="center"
      gap={2}
      width="100%"
      height="100%"
      backgroundColor={colors.background}
    >
      <Header />
      <box width="100%" maxWidth={78} paddingX={2}>
        <InputBar onSubmit={() => {}} />
      </box>
    </box>
  );

};

function App() {
  return (
    <ThemeProvider>
      <KeyboardLayerProvider>
        <DialogProvider>
          <ToastProvider>
            <ThemeRoot />
          </ToastProvider>
        </DialogProvider>
      </KeyboardLayerProvider>
    </ThemeProvider>
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<App />);
