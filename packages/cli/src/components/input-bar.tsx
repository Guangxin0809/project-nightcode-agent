import { useRenderer } from "@opentui/react";
import { useCallback, useEffect, useRef } from "react";
import type { KeyBinding, TextareaRenderable } from "@opentui/core";

import { EmptyBorder } from "./border";
import { StatusBar } from "./status-bar";
import { CommandMenu } from "./commad-menu";
import type { Command } from "./commad-menu/types";
import { useCommandMenu } from "./commad-menu/use-command-menu";

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

  const renderer = useRenderer();
  const onSubmitRef = useRef<() => void>(() => {});
  const textareaRef = useRef<TextareaRenderable>(null);

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
      });
    } else {
      textarea.insertText(command.value + " ");
    }

  }, [renderer]);

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
  }, []);

  onSubmitRef.current = () => {
    if (disabled) return;

    if (showCommandMenu) {
      const command = resolveCommand(selectedIndex);
      handleCommand(command);
      return;
    }

    handleSubmit();
  };

  return (
    <box alignItems="center" width="100%">
      <box
        width="100%"
        border={["left"]}
        borderColor="cyan"
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
          backgroundColor="#1A1A24"
        >
          {showCommandMenu && (
            <box
              position="absolute"
              left={0}
              bottom="120%"
              width="100%"
              backgroundColor="#1A1A24"
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
            focused={!disabled}
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