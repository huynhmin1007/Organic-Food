import { useRef, useState } from "react";
import "./App.css";
import Button from "./components/ui/Button";

function App() {
  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    cancel();
    timeRef.current = setTimeout(() => {
      console.log("Done");
    }, 2000);
  }

  function cancel() {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }
  }

  return (
    <>
      <Button onClick={start}>Start</Button>
      <Button onClick={cancel}>Cancel</Button>
    </>
  );
}

export default App;
