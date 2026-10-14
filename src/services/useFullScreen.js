import fscreen from "fscreen";
import { useCallback, useEffect, useRef, useState } from "react";

export function useFullscreen() {
  const fullscreenRef = useRef();
  const [active, setActive] = useState(false);
  useEffect(() => {
    const handleChange = () => {
      setActive(fscreen.fullscreenElement === fullscreenRef.current);
    };
    fscreen.addEventListener("fullscreenchange", handleChange);
    return () => fscreen.removeEventListener("fullscreenchange", handleChange);
  }, []);
  const enterFullscreen = useCallback(async () => {
    if (fscreen.fullscreenElement) {
      await fscreen.exitFullscreen();
    }
    return fscreen.requestFullscreen(fullscreenRef.current);
  }, []);
  const exitFullscreen = useCallback(async () => {
    if (fscreen.fullscreenElement === fullscreenRef.current) {
      return fscreen.exitFullscreen();
    }
  }, []);
  return {
    fullscreenRef,
    fullscreenEnabled: fscreen.fullscreenEnabled,
    fullscreenActive: active,
    enterFullscreen,
    exitFullscreen,
  };
}
