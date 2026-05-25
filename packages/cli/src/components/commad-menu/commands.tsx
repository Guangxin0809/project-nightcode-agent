import type { Command } from "./types";

export const COMMANDS: Command[] = [
  {
    name: "new",
    value: "/new",
    description: "Start a new conversation",
  },
  {
    name: "agents",
    value: "/agents",
    description: "Switch agents",
  },
  {
    name: "models",
    value: "/models",
    description: "Select AI model for generation",
  },
  {
    name: "sessions",
    value: "/sessions",
    description: "Browser past sessions",
  },
  {
    name: "theme",
    value: "/theme",
    description: "Change color theme",
  },
  {
    name: "login",
    value: "/login",
    description: "Sign in with your browser",
  },
  {
    name: "logout",
    value: "/logout",
    description: "Sign out of your account",
  },
  {
    name: "upgrade",
    value: "/upgrade",
    description: "Buy more credits",
  },
  {
    name: "usage",
    value: "/usage",
    description: "Open billing portal in your browser",
  },
  {
    name: "exit",
    value: "/exit",
    description: "Quit the application",
    action: (ctx) => {
      ctx.exit();
    },
  },
];