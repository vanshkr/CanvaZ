import { useEffect, useRef } from "react";

// From Dan Abramov's blog: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

export default function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
