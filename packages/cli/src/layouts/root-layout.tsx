import { Outlet } from "react-router";

import { ThemedRoot } from "./themed-root";
import { ToastProvider } from "../providers/toast";
import { ThemeProvider } from "../providers/theme";
import { DialogProvider } from "../providers/dialog";
import { KeyboardLayerProvider } from "../providers/keyboard-layer";

export function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <KeyboardLayerProvider>
          <DialogProvider>
            <ThemedRoot>
              <Outlet />
            </ThemedRoot>
          </DialogProvider>
        </KeyboardLayerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};