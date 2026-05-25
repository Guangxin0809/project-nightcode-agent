import { createRoot } from "@opentui/react";
import { createCliRenderer } from "@opentui/core";

import { Header } from "./components/header";
import { InputBar } from "./components/input-bar";

function App() {
  return (
    <box
      justifyContent="center"
      alignItems="center"
      gap={2}
      width="100%"
      height="100%"
      backgroundColor="#0D0D12"
    >
      <Header />
      <box width="100%" maxWidth={78} paddingX={2}>
        <InputBar onSubmit={() => {}} />
      </box>
    </box>
  );
}

const renderer = await createCliRenderer({
  targetFps: 60,
  exitOnCtrlC: false,
});
createRoot(renderer).render(<App />);
