import { useState } from "react";
import { useIntersect } from "./useIntersect";

export const useViewportVisibility = () => {
  const [visible, setVisible] = useState(false);
  const ref = useIntersect((entry) => {
    entry.isIntersecting ? setVisible(true) : setVisible(false);
  });

  return { ref, visible };
};
