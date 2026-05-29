import { useLocation, useNavigate } from "react-router";

import { SessionShell } from "../components/session-shell";
import { ErrorMessage, UserMessage, BotMessage } from "../components/messages";


export function NewSession() {

  const navigate = useNavigate();
  const lcoation = useLocation();

  const state = lcoation.state as { message?: string } | null;

  return (
    <SessionShell onSubmit={() => {}} loading interruptible>
      <UserMessage message={state?.message!} />
      <BotMessage
        content="This is a sample bot response to demonstrate the message layout"
        model="opus-4.6"
      />
      <ErrorMessage message="This is a sample error message" />
    </SessionShell>
  );

};