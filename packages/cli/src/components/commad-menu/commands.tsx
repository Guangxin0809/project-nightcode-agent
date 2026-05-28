import type { Command } from "./types";
import { ThemeDialogContent } from "../dialogs/theme-dialog";

export const COMMANDS: Command[] = [
  {
    name: "new",
    value: "/new",
    description: "Start a new conversation",
    action: (ctx) => {
      ctx.toast.show({ message: "Staring new conversation..." });
    },
  },
  {
    name: "agents",
    value: "/agents",
    description: "Switch agents",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Mode",
        children: <text>Agent selection coming soon...</text>
      });
    },
  },
  {
    name: "models",
    value: "/models",
    description: "Select AI model for generation",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Model",
        children: <text>Model selection coming soon...</text>
      });
    },
  },
  {
    name: "sessions",
    value: "/sessions",
    description: "Browser past sessions",
    action: (ctx) => {
      ctx.toast.show({ message: "Loading sessions..." });
    },
  },
  {
    name: "theme",
    value: "/theme",
    description: "Change color theme",
    action: (ctx) => {
      ctx.dialog.open({
        title: "Select Theme",
        children: <ThemeDialogContent />
      });
    },
  },
  {
    name: "login",
    value: "/login",
    description: "Sign in with your browser",
    action: (ctx) => {
      ctx.toast.show({ message: "Opening browser to sign in..." });
    },
  },
  {
    name: "logout",
    value: "/logout",
    description: "Sign out of your account",
    action: (ctx) => {
      ctx.toast.show({ variant: "success", message: "SIgned out" });
    },
  },
  {
    name: "upgrade",
    value: "/upgrade",
    description: "Buy more credits",
    action: (ctx) => {
      ctx.toast.show({ message: "Opening credits checkout..." });
    },
  },
  {
    name: "usage",
    value: "/usage",
    description: "Open billing portal in your browser",
    action: (ctx) => {
      ctx.toast.show({ message: "Opening billing portal..." });
    },
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