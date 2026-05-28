import type { ReactNode } from "react";
import { useTerminalDimensions } from "@opentui/react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import { useTheme } from "../theme";
import { DEFAULT_DURATION } from "./types";
import { SplitBorderChars } from "../../components/border";
import type { ToastOptions, ToastVariant } from "./types";

export type ToastContextValue = {
  show: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {

  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within a ToastProvider");
  };

  return value;

};

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {

  const [currentToast, setCurrentToast] = useState<ToastOptions | null>(null);
  const timeoutHandleRef = useRef<NodeJS.Timeout | null>(null);

  const clearCurrentTimeout = useCallback(() => {

    if (timeoutHandleRef.current) {
      clearTimeout(timeoutHandleRef.current);
      timeoutHandleRef.current = null;
    }

  }, []);

  const show = useCallback((options: ToastOptions) => {

    const duration = options.duration ?? DEFAULT_DURATION;

    clearCurrentTimeout();

    setCurrentToast({
      variant: options.variant || "info",
      ...options,
      duration,
    });

    timeoutHandleRef.current = setTimeout(() => {
      setCurrentToast(null);
    }, duration).unref();

  }, [clearCurrentTimeout]);

  const value: ToastContextValue = { show };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast currentToast={currentToast} />
    </ToastContext.Provider>
  );

};

type ToastProps = {
  currentToast: ToastOptions | null;
};

function Toast({ currentToast }: ToastProps) {

  const { colors } = useTheme();
  const { width } = useTerminalDimensions();

  if (!currentToast) return null;

  const variantColors: Record<ToastVariant, string> = {
    success: colors.success,
    error: colors.error,
    info: colors.info,
  };

  const borderColor = currentToast.variant
    ? variantColors[currentToast.variant]
    : variantColors.info;

  return (
    <box
      position="absolute"
      top={2}
      right={2}
      width={Math.max(1, Math.min(60, width - 6))}
      paddingTop={1}
      paddingRight={2}
      paddingBottom={1}
      paddingLeft={2}
      border={["left", "right"]}
      borderColor={borderColor}
      customBorderChars={SplitBorderChars}
      backgroundColor={colors.surface}
    >
      <box flexDirection="column" gap={1} width="100%">
        <text fg="#E1E1E1" wrapMode="word" width="100%">
          {currentToast.message}
        </text>
      </box>
    </box>
  );

};