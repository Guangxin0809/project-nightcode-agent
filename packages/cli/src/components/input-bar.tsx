import { useRenderer } from "@opentui/react";
import { useCallback, useEffect, useRef } from "react";
import type { KeyBinding, TextareaRenderable } from "@opentui/core";

import { EmptyBorder } from "./border";
import { StatusBar } from "./status-bar";
import { CommandMenu } from "./commad-menu";
import { useToast } from "../providers/toast";
import { useDialog } from "../providers/dialog";
import type { Command } from "./commad-menu/types";
import { useKeyboardLayer } from "../providers/keyboard-layer";
import { useCommandMenu } from "./commad-menu/use-command-menu";
import { useTheme } from "../providers/theme";

type Props = {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

export const TEXTAREA_KEY_BINDINGS: KeyBinding[] = [
  { name: "return", action: "submit" },
  { name: "enter", action: "submit" },
  { name: "return", shift: true, action: "newline" },
  { name: "enter", shift: true, action: "newline" },
];

export function InputBar({ onSubmit, disabled = false }: Props) {

  const toast = useToast();
  const dialog = useDialog();
  const { colors } = useTheme();
  const renderer = useRenderer();
  const onSubmitRef = useRef<() => void>(() => {});
  const textareaRef = useRef<TextareaRenderable>(null);
  const { isTopLayer, setResponder } = useKeyboardLayer();

  const {
    showCommandMenu,
    commandQuery,
    selectedIndex,
    scrollRef,
    handleContentChange,
    resolveCommand,
    setSelectedIndex
  } = useCommandMenu();

  // Wire up textarea submit handler once so it always reads the latest state
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.onSubmit = () => {
      onSubmitRef.current();
    };
  }, []);

  const handleCommand = useCallback((command: Command | undefined) => {

    const textarea = textareaRef.current;
    if (!textarea || !command) return;

    textarea.setText("");

    if (command.action) {
      command.action({
        exit: () => renderer.destroy(),
        toast,
        dialog,
      });
    } else {
      textarea.insertText(command.value + " ");
    }

  }, [renderer, toast, dialog]);

  const handleTextareaContentChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    handleContentChange(textarea.plainText);
  }, []);

  const handleSubmit = useCallback(() => {

    if (disabled) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.plainText.trim();
    if (text.length === 0) return;

    onSubmit(text);
    textarea.setText("");

  }, [disabled, onSubmit]);

  const handleCommandExecute = useCallback((index: number) => {
    const command = resolveCommand(index);
    handleCommand(command);
  }, [resolveCommand, handleCommand]);

  onSubmitRef.current = () => {
    if (disabled) return;

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return;
    }

    handleSubmit();
  };

  // Register the base layer responder for ctrl+c dismissal
  useEffect(() => {
    setResponder("base", () => {

      if (disabled) return false;

      const textarea = textareaRef.current;
      if (textarea && (textarea.plainText.length > 0)) {
        textarea.setText("");
        return true;
      }

      return false;

    });
  }, []);

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
          position="relative"
          justifyContent="center"
          gap={1}
          width="100%"
          paddingX={2}
          paddingY={1}
          backgroundColor={colors.surface}
        >
          {showCommandMenu && (
            <box
              position="absolute"
              left={0}
              bottom="120%"
              width="100%"
              backgroundColor={colors.surface}
              zIndex={10}
            >
              <CommandMenu
                query={commandQuery}
                selectedIndex={selectedIndex}
                scrollRef={scrollRef}
                onSelect={setSelectedIndex}
                onExecute={handleCommandExecute}
              />
            </box>
          )}

          <textarea
            ref={textareaRef}
            focused={
              !disabled &&
              (isTopLayer("base") || isTopLayer("command"))
            }
            keyBindings={TEXTAREA_KEY_BINDINGS}
            onContentChange={handleTextareaContentChange}
            placeholder={`Ask anything... "Fix a bug in the database"`}
          />
          <StatusBar />
        </box>
      </box>
    </box>
  );
}