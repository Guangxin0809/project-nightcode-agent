import { useCallback } from "react";
import { useNavigate } from "react-router";
import { TextAttributes } from "@opentui/core";

import { Header } from "../components/header";
import { InputBar } from "../components/input-bar";

export function Home() {

  const navigate = useNavigate();

  const handleSubmit = useCallback((text: string) => {
    navigate("/sessions/123", { state: { message: text } });
  }, [navigate]);

  return (
    <box
      position="relative"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      gap={2}
      width="100%"
      height="100%"
    >
      <Header />
      <box
        flexDirection="column"
        gap={1}
        width="100%"
        maxWidth={78}
        paddingX={2}
      >
        <InputBar onSubmit={handleSubmit} />
        <box flexDirection="row" flexShrink={0} gap={1} marginLeft="auto">
          <text>tab</text>
          <text attributes={TextAttributes.DIM}>agents</text>
        </box>
      </box>
    </box>
  );

};