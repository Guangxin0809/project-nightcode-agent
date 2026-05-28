import type { ReactNode } from "react";
import { TextAttributes, RGBA } from "@opentui/core";
import { useKeyboard, useTerminalDimensions } from "@opentui/react";
import { createContext, useContext, useCallback, useState } from "react";

import { useTheme } from "../theme";
import type { DialogConfig } from "./types";
import { useKeyboardLayer } from "../keyboard-layer";

export type DialogContextValue = {
  open: (config: DialogConfig) => void;
  close: () => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

export function useDialog(): DialogContextValue {

  const value = useContext(DialogContext);
  if (!value) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return value;

};

export function DialogProvider({ children }: { children: ReactNode }) {

  const [currentDialog, setCurrentDialog] = useState<DialogConfig | null>(null);
  const { push, pop } = useKeyboardLayer();

  const close = useCallback(() => {
    setCurrentDialog(null);
    pop("dialog");
  }, [pop]);

  const open = useCallback((config: DialogConfig) => {
    setCurrentDialog(config);
    push("dialog", () => {
      close();
      return true;
    });
  }, [push, close]);

  const value: DialogContextValue = { open, close };

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog currentDialog={currentDialog} close={close} />
    </DialogContext.Provider>
  );

};

type DialogProps = {
  currentDialog: DialogConfig | null;
  close: () => void;
};

function Dialog({ currentDialog, close }: DialogProps) {

  const { colors } = useTheme();
  const { isTopLayer } = useKeyboardLayer();
  const dimensions = useTerminalDimensions();

  useKeyboard((key) => {
    if (!currentDialog || !isTopLayer("dialog")) return;

    if (key.name === "escape") {
      close();
    }
  });

  if (!currentDialog) {
    return null;
  }

  const { title, children } = currentDialog;

  return (
    <box
      position="absolute"
      left={0}
      top={0}
      justifyContent="center"
      alignItems="center"
      width={dimensions.width}
      height={dimensions.height}
      backgroundColor={RGBA.fromInts(0, 0, 0, 150)}
      zIndex={100}
      onMouseDown={() => close()}
    >
      <box
        flexDirection="column"
        gap={1}
        width={Math.min(60, dimensions.width - 4)}
        height="auto"
        paddingX={4}
        paddingY={1}
        backgroundColor={colors.dialogSurface}
        onMouseDown={e => e.stopPropagation()}
      >
        <box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingBottom={1}
        >
          <text attributes={TextAttributes.BOLD}>{title}</text>
          <text
            attributes={TextAttributes.DIM}
            onMouseDown={() => close()}
          >
            esc
          </text>
        </box>
        <box flexGrow={1}>{children}</box>
      </box>
    </box>
  );

};