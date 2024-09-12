import { getRandomInt } from "@/utils/getRandomNumber";
import { wait } from "@/utils/wait";
import { assert } from "@/utils/assert";
import { useEffect, useReducer, useRef } from "react";

let waitController: AbortController | undefined;

// https://gist.github.com/tkrotoff/db8a8106cc93ae797ea968d78ea28047
// https://stackoverflow.com/q/60755316
// https://stackoverflow.com/q/55624695
export function useProgressBar({
  trickleMaxWidth = 94,
  trickleIncrementMin = 1,
  trickleIncrementMax = 5,
  dropMinSpeed = 50,
  dropMaxSpeed = 150,
  // https://github.com/twbs/bootstrap/blob/v5.3.0-alpha1/scss/_variables.scss#L1529
  transitionSpeed = 600,
} = {}) {
  // https://stackoverflow.com/a/66436476
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // https://github.com/facebook/react/issues/14010#issuecomment-433788147
  const widthRef = useRef(0);

  function setWidth(value: number) {
    widthRef.current = value;
    forceUpdate();
  }

  async function trickle() {
    if (widthRef.current < trickleMaxWidth) {
      const inc =
        widthRef.current +
        getRandomInt(trickleIncrementMin, trickleIncrementMax); // ~3
      setWidth(inc);
      try {
        await wait(getRandomInt(dropMinSpeed, dropMaxSpeed) /* ~100 ms */, {
          signal: waitController!.signal,
        });
        await trickle();
      } catch {
        // Current loop aborted: a new route has been started
      }
    }
  }

  async function start() {
    // Abort current loops if any: a new route has been started
    waitController?.abort();
    waitController = new AbortController();

    // Force the show the JSX
    setWidth(1);
    await wait(0);

    await trickle();
  }

  async function complete() {
    assert(
      waitController !== undefined,
      "Make sure start() is called before calling complete()",
    );
    setWidth(100);
    try {
      await wait(transitionSpeed, { signal: waitController.signal });
      setWidth(0);
    } catch {
      // Current loop aborted: a new route has been started
    }
  }

  function reset() {
    // Abort current loops if any
    waitController?.abort();
    setWidth(0);
  }

  useEffect(() => {
    return () => {
      // Abort current loops if any
      waitController?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    start,
    complete,
    reset,
    width: widthRef.current,
  };
}
