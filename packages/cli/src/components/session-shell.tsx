import type { ReactNode } from "react";
import { TextAttributes } from "@opentui/core";

import { Spinner } from "./spinner";
import { InputBar } from "./input-bar";

type Props = {
  onSubmit: (text: string) => void;
  children?: ReactNode;
  loading?: boolean;
  inputDisabled?: boolean;
  interruptible?: boolean;
};

export function SessionShell({
  onSubmit,
  children,
  loading = false,
  inputDisabled = false,
  interruptible = false,
}: Props) {

  return (
    <box
      flexDirection="column"
      flexGrow={1}
      gap={1}
      width="100%"
      height="100%"
      paddingY={1}
      paddingX={2}
    >
      <scrollbox flexGrow={1} width="100%" stickyScroll stickyStart="bottom">
        <box>{children}</box>
      </scrollbox>

      <box flexShrink={0}>
        <InputBar onSubmit={onSubmit} disabled={inputDisabled} />
      </box>

      <box
        flexDirection="column"
        justifyContent="space-between"
        flexShrink={0}
        gap={2}
        width="100%"
        height={1}
        paddingLeft={1}
      >
        <box flexDirection="row" alignItems="center" gap={2}>
          {loading ? (
            <>
              <Spinner />
              {interruptible ? <text>esc to interrupt</text> : null}
            </>
          ) : null}
        </box>

        <box flexDirection="row" flexShrink={0} gap={1} marginLeft="auto">
          <text>tab</text>
          <text attributes={TextAttributes.DIM}>agents</text>
        </box>
      </box>
    </box>
  );

};