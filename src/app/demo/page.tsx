"use client";

import { useQueryState, parseAsString, parseAsStringEnum } from "nuqs";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes = ["light", "dark"] as const;

type Theme = (typeof themes)[number];

const tabs = ["components", "theme-demo", "search-demo"] as const;
type Tab = (typeof tabs)[number];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.8, y: 50 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export function Demo() {
  const [theme, setTheme] = useQueryState(
    "theme",
    parseAsStringEnum([...themes]).withDefault("light")
  );
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum([...tabs]).withDefault("components")
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleData = [
    {
      id: 1,
      name: "Next.js",
      description: "React framework for production",
      category: "Framework",
    },
    {
      id: 2,
      name: "Tailwind CSS",
      description: "Utility-first CSS framework",
      category: "Styling",
    },
    {
      id: 3,
      name: "daisyUI",
      description: "Component library for Tailwind CSS",
      category: "Components",
    },
    {
      id: 4,
      name: "nuqs",
      description: "Type-safe search params state manager",
      category: "State Management",
    },
    {
      id: 5,
      name: "TypeScript",
      description: "Typed superset of JavaScript",
      category: "Language",
    },
    {
      id: 6,
      name: "Bun",
      description: "Fast all-in-one JavaScript runtime",
      category: "Runtime",
    },
    {
      id: 7,
      name: "Framer Motion",
      description: "Production-ready motion library for React",
      category: "Animation",
    },
  ];

  const filteredData = sampleData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div data-theme={theme} className="min-h-screen">
      {/* Header */}
      <motion.div
        className="navbar bg-base-100 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex-1">
          <motion.a
            className="btn btn-ghost text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎨 Demo App
          </motion.a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <motion.div
              tabIndex={0}
              role="button"
              className="btn btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Theme: {theme}
              <motion.svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: 0 }}
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.div>
            <motion.ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto"
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {themes.map((t, index) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <motion.a
                    onClick={() => setTheme(t)}
                    className={theme === t ? "active" : ""}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.1 }}
                  >
                    {t}
                  </motion.a>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto p-4">
        {/* Tabs */}
        <motion.div
          className="tabs tabs-boxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {tabs.map((tab, index) => (
            <motion.a
              key={tab}
              className={`tab ${activeTab === tab ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              {tab.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </motion.a>
          ))}
        </motion.div>

        {/* Tab Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          {/* Components Tab */}
          {activeTab === "components" && (
            <motion.div
              key="components"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.div
                className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              >
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <motion.h1
                      className="text-5xl font-bold"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Hello there
                    </motion.h1>
                    <motion.p
                      className="py-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      This is a demo showcasing Next.js with daisyUI components,
                      nuqs for URL state management, and Framer Motion
                      animations.
                    </motion.p>
                    <motion.button
                      className="btn btn-accent"
                      onClick={() => setIsModalOpen(true)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      Open Modal
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Cards Grid with Stagger Animation */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {[
                  {
                    title: "daisyUI Components",
                    desc: "Beautiful, semantic component classes for Tailwind CSS",
                    btn: "Learn More",
                    color: "btn-primary",
                  },
                  {
                    title: "nuqs Integration",
                    desc: "Type-safe search params state management with React",
                    btn: "Explore",
                    color: "btn-secondary",
                  },
                  {
                    title: "Next.js App Router",
                    desc: "Modern React framework with server components",
                    btn: "Get Started",
                    color: "btn-accent",
                  },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    className="card bg-base-100 shadow-xl"
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="card-body">
                      <motion.h2
                        className="card-title"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {card.title}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        {card.desc}
                      </motion.p>
                      <div className="card-actions justify-end">
                        <motion.button
                          className={`btn ${card.color}`}
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          {card.btn}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Button Showcase */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h2 className="text-2xl font-bold">
                  Animated Button Variations
                </h2>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    { class: "btn", text: "Default" },
                    { class: "btn btn-primary", text: "Primary" },
                    { class: "btn btn-secondary", text: "Secondary" },
                    { class: "btn btn-accent", text: "Accent" },
                    { class: "btn btn-ghost", text: "Ghost" },
                    { class: "btn btn-link", text: "Link" },
                    { class: "btn btn-outline", text: "Outline" },
                    {
                      class: "btn btn-outline btn-primary",
                      text: "Outline Primary",
                    },
                  ].map((btn, index) => (
                    <motion.button
                      key={index}
                      className={btn.class}
                      variants={staggerItem}
                      whileHover={{ scale: 1.1, rotate: [0, -1, 1, 0] }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {btn.text}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>

              {/* Progress and Stats */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">
                    Animated Progress Indicators
                  </h3>
                  <motion.progress
                    className="progress progress-primary w-full"
                    value="70"
                    max="100"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  />
                  <motion.progress
                    className="progress progress-secondary w-full"
                    value="85"
                    max="100"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                  />
                  <motion.progress
                    className="progress progress-accent w-full"
                    value="95"
                    max="100"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                  />
                </div>

                <motion.div
                  className="stats shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="stat">
                    <div className="stat-title">Total Page Views</div>
                    <motion.div
                      className="stat-value"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 1.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      89,400
                    </motion.div>
                    <div className="stat-desc">21% more than last month</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Theme Demo Tab */}
          {activeTab === "theme-demo" && (
            <motion.div
              key="theme-demo"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div
                className="alert alert-info"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Current theme: <strong>{theme}</strong> - Try switching themes
                  from the header dropdown!
                </span>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold">Color Palette</h3>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {[
                      { class: "badge badge-primary", text: "Primary" },
                      { class: "badge badge-secondary", text: "Secondary" },
                      { class: "badge badge-accent", text: "Accent" },
                      { class: "badge badge-neutral", text: "Neutral" },
                      { class: "badge badge-info", text: "Info" },
                      { class: "badge badge-success", text: "Success" },
                      { class: "badge badge-warning", text: "Warning" },
                      { class: "badge badge-error", text: "Error" },
                    ].map((badge, index) => (
                      <motion.div
                        key={index}
                        className={badge.class}
                        variants={staggerItem}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {badge.text}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold">Theme Preview</h3>
                  <motion.div
                    className="mockup-window border bg-base-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-center px-4 py-16 bg-base-200">
                      <div className="text-center">
                        <motion.h4
                          className="text-lg font-bold"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          Sample Content
                        </motion.h4>
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          This shows how the theme affects different elements
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <div className="divider">Theme Grid</div>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {themes.slice(0, 12).map((t, index) => (
                  <motion.button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`btn btn-sm ${
                      theme === t ? "btn-primary" : "btn-outline"
                    }`}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    {t}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Search Demo Tab */}
          {activeTab === "search-demo" && (
            <motion.div
              key="search-demo"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div
                className="alert alert-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  Search query is synchronized with URL params using nuqs!
                </span>
              </motion.div>

              <motion.div
                className="form-control"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="label">
                  <span className="label-text">Search technologies:</span>
                </label>
                <motion.input
                  type="text"
                  placeholder="Search for frameworks, libraries, tools..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={searchQuery}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="card bg-base-100 shadow-md"
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        layout
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="card-body">
                          <motion.h2
                            className="card-title text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                          >
                            {item.name}
                            <motion.div
                              className="badge badge-secondary badge-sm"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2 + index * 0.05,
                                type: "spring",
                                stiffness: 300,
                              }}
                            >
                              {item.category}
                            </motion.div>
                          </motion.h2>
                          <motion.p
                            className="text-sm opacity-70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 0.15 + index * 0.05 }}
                          >
                            {item.description}
                          </motion.p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="col-span-full text-center py-12"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="text-6xl opacity-20 mb-4"
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      >
                        🔍
                      </motion.div>
                      <p className="text-lg opacity-70">
                        No results found for "{searchQuery}"
                      </p>
                      <motion.button
                        className="btn btn-ghost btn-sm mt-2"
                        onClick={() => setSearchQuery("")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear search
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal modal-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="modal-box"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <motion.h3
                className="font-bold text-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Hello from daisyUI Modal! 🎉
              </motion.h3>
              <motion.p
                className="py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                This modal demonstrates daisyUI's modal component with beautiful
                Framer Motion animations and React state management.
              </motion.p>
              <motion.div
                className="modal-action"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(false)}
                  whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                  whileTap={{ scale: 0.95 }}
                >
                  Got it!
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DemoPage = () => {
  return (
    <Suspense>
      <Demo />
    </Suspense>
  );
};

export default DemoPage;
