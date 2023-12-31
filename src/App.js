import { useEffect, useRef, useState } from "react";

let minutes = 25;
let seconds = 0;
let defaultResetSeconds = 59;
let timerID;
let timer = "";
let playMode = "stopped";
const defaultSeconds = 0;
const defaultSessionLength = 25;
const defaultBreakLength = 5;
const maxSessionLength = 60;
const minSessionLength = 1;
const maxBreakLength = 60;
const minBreakLength = 1;
let mode = "session";

function App() {
  const [time, setTime] = useState(
    `${formatTimer(defaultSessionLength)}:${formatTimer(defaultSeconds)}`
  );

  const [sessionLength, setSessionLength] = useState(defaultSessionLength);

  const [breakLength, setBreakLength] = useState(defaultBreakLength);

  const [title, setTitle] = useState("session");

  const [running, setRunning] = useState(false);
  const audio = useRef("");

  useEffect(() => {
    setTime(`${formatTimer(sessionLength)}:${formatTimer(defaultSeconds)}`);
  }, [sessionLength]);

  useEffect(() => {
    if (time === "00:00") {
      playMode = "stopped";
      clearInterval(timerID);
      audio.current.play();
      if (mode !== "break") {
        mode = "break";
        setTitle("break");
        setTimeout(handleClick, 1000);
      } else {
        mode = "session";
        setTitle("session");
        setTimeout(handleClick, 1000);
      }
    }
  }, [time, breakLength, sessionLength]);

  function formatTimer(tim) {
    if (tim.toString().length === 1) {
      return `0${tim}`;
    } else {
      return tim;
    }
  }

  function handleClock() {
    setRunning(true);
    seconds = seconds - 1;
    if (seconds < 0) {
      minutes = minutes - 1;
      seconds = 59;
    }
    timer = `${formatTimer(minutes)}:${formatTimer(seconds)}`;
    setTime((t) => timer);
  }

  function handleReset() {
    mode = "session";
    clearInterval(timerID);
    setSessionLength(defaultSessionLength);
    setBreakLength(defaultBreakLength);
    setRunning(false);
    setTitle((t) => "session");
    playMode = "stopped";
    setTime(
      `${formatTimer(defaultSessionLength)}:${formatTimer(defaultSeconds)}`
    );
    audio.current.pause();
    audio.current.currentTime = 0;
  }

  function handleClick() {
    console.log(playMode);
    console.log(mode);
    if (playMode === "stopped") {
      minutes = mode === "break" ? breakLength : sessionLength;
      seconds = defaultSeconds;
      playMode = "playing";
      timer = `${formatTimer(minutes)}:${formatTimer(seconds)}`;
      setTime((t) => timer);
      timerID = setInterval(handleClock, 1000);
    } else if (playMode === "playing") {
      playMode = "paused";
      clearInterval(timerID);
    } else if (playMode === "paused") {
      playMode = "playing";
      timerID = setInterval(handleClock, 1000);
    }
  }

  function handleSessionIncrease() {
    if (!running) {
      setSessionLength((s) => {
        let newSessionLength = s + 1;
        if (newSessionLength > 60) {
          newSessionLength = 60;
        }

        return newSessionLength;
      });
    }
  }

  function handleSessionDecrease() {
    if (!running) {
      setSessionLength((s) => {
        let newSessionLength = s - 1;
        if (newSessionLength <= 1) {
          newSessionLength = 1;
        }

        return newSessionLength;
      });
    }
  }

  function handleBreakIncrease() {
    if (!running) {
      setBreakLength((s) => {
        let newBreakLength = s + 1;
        if (newBreakLength >= 60) {
          newBreakLength = 60;
        }
        return newBreakLength;
      });
    }
  }
  function handleBreakDecrease() {
    if (!running) {
      setBreakLength((s) => {
        let newBreakLength = s - 1;
        if (newBreakLength <= 1) {
          newBreakLength = 1;
        }
        return newBreakLength;
      });
    }
  }
  return (
    <div>
      <h3>Clock</h3>
      <label id="session-label">Session Length</label>
      <p id="session-length">{sessionLength}</p>
      <button id="session-increment" onClick={handleSessionIncrease}>
        Session Increase
      </button>
      <button id="session-decrement" onClick={handleSessionDecrease}>
        Session Decrease
      </button>

      <p id="timer-label">{title}</p>
      <p id="time-left">{time}</p>
      <button id="start_stop" onClick={handleClick}>
        STOP/START
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>

      <p id="break-length">{breakLength}</p>
      <label id="break-label">Break Length</label>
      <button id="break-increment" onClick={handleBreakIncrease}>
        Break Increase
      </button>
      <button id="break-decrement" onClick={handleBreakDecrease}>
        Break Decrease
      </button>
      <audio id="beep" src="/beep.mp3" ref={audio}></audio>
    </div>
  );
}

export default App;
