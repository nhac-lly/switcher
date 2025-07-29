"use client";

import { useQueryState, parseAsStringEnum } from "nuqs";
import { motion } from "framer-motion";
import { Suspense, useRef } from "react";

const scenes = ["1", "2"] as const;
const sceneUrls = {
  "1": "https://arobidglobal.shapespark.com/arobid_booth_mobile-test/",
  "2": "https://arobidglobal.shapespark.com/arobid-demo/",
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function Home() {
  const [sceneQuery, setSceneQuery] = useQueryState(
    "scene",
    parseAsStringEnum([...scenes]).withDefault("1")
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-base-100"
    >
      <iframe
        id="scene-iframe"
        key={sceneQuery}
        ref={iframeRef}
        style={{ width: "100dvw", height: "100dvh", border: "none" }}
        allow="gyroscope; accelerometer; xr-spatial-tracking; vr;"
        src={sceneUrls[sceneQuery]}
      ></iframe>
    </motion.div>
  );
}

const HomePage = () => {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
};

export default HomePage;
