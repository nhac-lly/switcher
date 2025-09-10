"use client";

import { MotionProps } from "motion/react";
import * as motion from "motion/react-client";
import { handleAddKey } from "../server-actions";

const motionProps: MotionProps = {
  transition: {
    type: "spring",
  },
  initial: { x: -5 },
  animate: { x: [5, 0] },
};

const KeyPage = () => {
  return (
    <motion.div
      className="flex justify-center  items-center h-screen"
      {...motionProps}
    >
      <motion.div
        drag
        dragSnapToOrigin
        whileDrag={{ scale: 0.9 }}
        dragElastic={0.1}
        dragTransition={{
          // tune the snap spring (pudding wobble)
          bounceStiffness: 700,
          bounceDamping: 18,
          timeConstant: 120,
        }}
        className="card relative bg-gradient-to-r from-primary/50 to-secondary/50 image-full w-96 shadow-sm backdrop-blur-xl"
        {...motionProps}
      >
        {/* gradient shadow */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 5, // slow spin in seconds
          }}
          className="w-96 h-96 absolute inset-x-0 -inset-y-1/3 mx-auto rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 blur-2xl opacity-70"
        />
        <motion.div
          {...motionProps}
          className="card-body flex flex-col justify-between gap-4"
        >
          <motion.h1 {...motionProps} className="card-title">
            Login
          </motion.h1>
          <motion.form
            {...motionProps}
            action={handleAddKey}
            className="flex flex-col gap-4"
          >
            <motion.input
              {...motionProps}
              className="input input-bordered"
              type="key"
              name="key"
              placeholder="Key"
            />
            <motion.input
              {...motionProps}
              className="input input-bordered"
              type="key2"
              name="key2"
              placeholder="Key2"
            />
            <motion.div {...motionProps} className="card-actions justify-end">
              <motion.button
                {...motionProps}
                type="submit"
                className="btn btn-primary"
              >
                Next
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default KeyPage;
