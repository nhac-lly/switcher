"use client";

import { useQueryState, parseAsStringEnum } from "nuqs";
import { motion } from "framer-motion";
import { Suspense, useRef } from "react";

const scenes = ["1", "2", "3"] as const;
const sceneUrls = {
  "1": "https://threed.arobid.com/3d/ck8XO4Ud0bB6QMP1Z+NSPA==/viewer#autoplay",
  "2": "https://threed.arobid.com/3d/rL+431JWH9yfDqt50O8hsA==/viewer#autoplay",
  "3": "https://threed.arobid.com/3d/7YqMSGBroj3SXdhgk3d+Gg==/viewer#autoplay",
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
