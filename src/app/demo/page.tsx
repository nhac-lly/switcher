"use client";

import { useQueryState, parseAsString, parseAsStringEnum } from "nuqs";
import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Haptic feedback utility functions
const haptic = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(20),
  heavy: () => navigator.vibrate?.(30),
  success: () => navigator.vibrate?.([10, 50, 20]),
  error: () => navigator.vibrate?.([50, 100, 50]),
  pattern: (pattern: number[]) => navigator.vibrate?.(pattern),
  // Custom haptic patterns
  button: () => navigator.vibrate?.([5, 10, 5]),
  card: () => navigator.vibrate?.([8, 15, 8]),
  modal: () => navigator.vibrate?.([15, 30, 15]),
  theme: () => navigator.vibrate?.([10, 20, 10]),
  tab: () => navigator.vibrate?.([5, 8, 5]),
  search: () => navigator.vibrate?.([3, 6, 3]),
  // Additional haptic patterns for testing
  notification: () => navigator.vibrate?.([100, 50, 100]),
  alert: () => navigator.vibrate?.([200, 100, 200]),
  tick: () => navigator.vibrate?.([5]),
  double: () => navigator.vibrate?.([10, 0, 10]),
  triple: () => navigator.vibrate?.([10, 0, 10, 0, 10]),
};

const themes = ["light", "dark"] as const;

type Theme = (typeof themes)[number];

const tabs = ["components", "theme-demo", "search-demo", "haptics"] as const;
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

  // Enhanced handlers with haptic feedback
  const handleThemeChange = (newTheme: Theme) => {
    haptic.theme();
    setTheme(newTheme);
  };

  const handleTabChange = (newTab: Tab) => {
    haptic.tab();
    setActiveTab(newTab);
  };

  const handleModalOpen = () => {
    haptic.modal();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    haptic.button();
    setIsModalOpen(false);
  };

  const handleSearchChange = (value: string) => {
    if (value !== searchQuery) {
      haptic.search();
    }
    setSearchQuery(value);
  };

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
        onAnimationStart={() => haptic.light()}
      >
        <div className="flex-1">
          <motion.a
            className="btn btn-ghost text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onTap={() => haptic.button()}
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
              onTap={() => haptic.button()}
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
                onAnimationStart={() => haptic.light()}
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
              onAnimationStart={() => haptic.light()}
            >
              {themes.map((t, index) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <motion.a
                    onClick={() => handleThemeChange(t)}
                    className={theme === t ? "active" : ""}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.1 }}
                    onTap={() => haptic.theme()}
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
          onAnimationStart={() => haptic.light()}
        >
          {tabs.map((tab, index) => (
            <motion.a
              key={tab}
              className={`tab ${activeTab === tab ? "tab-active" : ""}`}
              onClick={() => handleTabChange(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onTap={() => haptic.tab()}
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
              onAnimationStart={() => haptic.medium()}
            >
              <motion.div
                className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="hero-content text-center">
                  <div className="max-w-md">
                    <motion.h1
                      className="text-5xl font-bold"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      onAnimationStart={() => haptic.light()}
                    >
                      Hello there
                    </motion.h1>
                    <motion.p
                      className="py-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      onAnimationStart={() => haptic.light()}
                    >
                      This is a demo showcasing Next.js with daisyUI components,
                      nuqs for URL state management, and Framer Motion
                      animations with haptic feedback!
                    </motion.p>
                    <motion.button
                      className="btn btn-accent"
                      onClick={handleModalOpen}
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
                      onTap={() => haptic.button()}
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
                onAnimationStart={() => haptic.light()}
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
                    onHoverStart={() => haptic.card()}
                    onTap={() => haptic.card()}
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
                          onTap={() => haptic.button()}
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
                onAnimationStart={() => haptic.light()}
              >
                <h2 className="text-2xl font-bold">
                  Animated Button Variations with Haptics
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
                      onTap={() => haptic.button()}
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
                onAnimationStart={() => haptic.light()}
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
                    onAnimationComplete={() => haptic.light()}
                  />
                  <motion.progress
                    className="progress progress-secondary w-full"
                    value="85"
                    max="100"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    onAnimationComplete={() => haptic.light()}
                  />
                  <motion.progress
                    className="progress progress-accent w-full"
                    value="95"
                    max="100"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                    onAnimationComplete={() => haptic.success()}
                  />
                </div>

                <motion.div
                  className="stats shadow"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onHoverStart={() => haptic.light()}
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
                      onAnimationComplete={() => haptic.success()}
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
              onAnimationStart={() => haptic.medium()}
            >
              <motion.div
                className="alert alert-info"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                onAnimationStart={() => haptic.light()}
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
                  onAnimationStart={() => haptic.light()}
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
                        onTap={() => haptic.light()}
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
                  onAnimationStart={() => haptic.light()}
                >
                  <h3 className="text-xl font-bold">Theme Preview</h3>
                  <motion.div
                    className="mockup-window border bg-base-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onHoverStart={() => haptic.light()}
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
                    onClick={() => handleThemeChange(t)}
                    className={`btn btn-sm ${
                      theme === t ? "btn-primary" : "btn-outline"
                    }`}
                    variants={staggerItem}
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    onTap={() => haptic.theme()}
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
              onAnimationStart={() => haptic.medium()}
            >
              <motion.div
                className="alert alert-success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                onAnimationStart={() => haptic.light()}
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
                onAnimationStart={() => haptic.light()}
              >
                <label className="label">
                  <span className="label-text">Search technologies:</span>
                </label>
                <motion.input
                  type="text"
                  placeholder="Search for frameworks, libraries, tools..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onFocus={() => haptic.light()}
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
                        onHoverStart={() => haptic.card()}
                        onTap={() => haptic.card()}
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
                              onAnimationComplete={() => haptic.light()}
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
                        onAnimationStart={() => haptic.light()}
                      >
                        🔍
                      </motion.div>
                      <p className="text-lg opacity-70">
                        No results found for "{searchQuery}"
                      </p>
                      <motion.button
                        className="btn btn-ghost btn-sm mt-2"
                        onClick={() => handleSearchChange("")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onTap={() => haptic.button()}
                      >
                        Clear search
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Haptics Tab */}
          {activeTab === "haptics" && (
            <motion.div
              key="haptics"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
              onAnimationStart={() => haptic.medium()}
            >
              {/* Hero Section */}
              <motion.div
                className="hero bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="hero-content text-center">
                  <div className="max-w-2xl">
                    <motion.h1
                      className="text-4xl font-bold mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      onAnimationStart={() => haptic.light()}
                    >
                      🎯 Haptic Feedback Testing Lab
                    </motion.h1>
                    <motion.p
                      className="py-4 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      onAnimationStart={() => haptic.light()}
                    >
                      Test all forms of haptic feedback to find the perfect
                      patterns for your app's user experience. Each button
                      triggers a different haptic sensation - try them all!
                    </motion.p>
                    <motion.div
                      className="badge badge-lg badge-outline"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Works on mobile devices with Vibration API
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Basic Intensity Section */}
              <motion.div
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    📊 Basic Haptic Intensities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      className="btn btn-primary btn-lg"
                      onClick={() => haptic.light()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.light()}
                    >
                      <span className="text-2xl">⚡</span>
                      <div className="text-left">
                        <div className="font-bold">Light</div>
                        <div className="text-xs opacity-70">10ms vibration</div>
                      </div>
                    </motion.button>
                    <motion.button
                      className="btn btn-secondary btn-lg"
                      onClick={() => haptic.medium()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.medium()}
                    >
                      <span className="text-2xl">⚡⚡</span>
                      <div className="text-left">
                        <div className="font-bold">Medium</div>
                        <div className="text-xs opacity-70">20ms vibration</div>
                      </div>
                    </motion.button>
                    <motion.button
                      className="btn btn-accent btn-lg"
                      onClick={() => haptic.heavy()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.heavy()}
                    >
                      <span className="text-2xl">⚡⚡⚡</span>
                      <div className="text-left">
                        <div className="font-bold">Heavy</div>
                        <div className="text-xs opacity-70">30ms vibration</div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Success/Error Section */}
              <motion.div
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    ✅❌ Success & Error Patterns
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.button
                      className="btn btn-success btn-lg w-full"
                      onClick={() => haptic.success()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.success()}
                    >
                      <span className="text-2xl">✅</span>
                      <div className="text-left">
                        <div className="font-bold">Success Pattern</div>
                        <div className="text-xs opacity-70">
                          [10, 50, 20] - Gentle confirmation
                        </div>
                      </div>
                    </motion.button>
                    <motion.button
                      className="btn btn-error btn-lg w-full"
                      onClick={() => haptic.error()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.error()}
                    >
                      <span className="text-2xl">❌</span>
                      <div className="text-left">
                        <div className="font-bold">Error Pattern</div>
                        <div className="text-xs opacity-70">
                          [50, 100, 50] - Attention alert
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Custom Pattern Section */}
              <motion.div
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    🎛️ Custom Pattern Creator
                  </h2>
                  <div className="space-y-4">
                    <motion.input
                      type="text"
                      placeholder="Enter custom pattern (e.g., 100, 50, 100, 200)"
                      className="input input-bordered input-lg w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const pattern = e.currentTarget.value
                            .split(",")
                            .map((p) => parseInt(p.trim(), 10))
                            .filter((p) => !isNaN(p));
                          if (pattern.length > 0) {
                            haptic.pattern(pattern);
                          }
                        }
                      }}
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      onFocus={() => haptic.light()}
                    />
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        className="btn btn-sm btn-outline"
                        onClick={() => haptic.pattern([100, 50, 100])}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onTap={() => haptic.pattern([100, 50, 100])}
                      >
                        Quick Test: [100, 50, 100]
                      </motion.button>
                      <motion.button
                        className="btn btn-sm btn-outline"
                        onClick={() => haptic.pattern([50, 100, 50])}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onTap={() => haptic.pattern([50, 100, 50])}
                      >
                        Quick Test: [50, 100, 50]
                      </motion.button>
                    </div>
                    <p className="text-sm opacity-70">
                      💡 Press Enter to test your custom pattern. Format:
                      comma-separated milliseconds
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* UI Component Haptics */}
              <motion.div
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    🎨 UI Component Haptics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      className="btn btn-outline btn-primary"
                      onClick={() => haptic.button()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.button()}
                    >
                      <span className="text-xl">🔘</span>
                      Button Haptic
                      <div className="text-xs opacity-70">[5, 10, 5]</div>
                    </motion.button>
                    <motion.button
                      className="btn btn-outline btn-secondary"
                      onClick={() => haptic.card()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.card()}
                    >
                      <span className="text-xl">🃏</span>
                      Card Haptic
                      <div className="text-xs opacity-70">[8, 15, 8]</div>
                    </motion.button>
                    <motion.button
                      className="btn btn-outline btn-accent"
                      onClick={() => haptic.modal()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.modal()}
                    >
                      <span className="text-xl">🪟</span>
                      Modal Haptic
                      <div className="text-xs opacity-70">[15, 30, 15]</div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Haptics */}
              <motion.div
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    🧭 Navigation Haptics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      className="btn btn-outline btn-info"
                      onClick={() => haptic.theme()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.theme()}
                    >
                      <span className="text-xl">🎨</span>
                      Theme Haptic
                      <div className="text-xs opacity-70">[10, 20, 10]</div>
                    </motion.button>
                    <motion.button
                      className="btn btn-outline btn-warning"
                      onClick={() => haptic.tab()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.tab()}
                    >
                      <span className="text-xl">📑</span>
                      Tab Haptic
                      <div className="text-xs opacity-70">[5, 8, 5]</div>
                    </motion.button>
                    <motion.button
                      className="btn btn-outline btn-success"
                      onClick={() => haptic.search()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.search()}
                    >
                      <span className="text-xl">🔍</span>
                      Search Haptic
                      <div className="text-xs opacity-70">[3, 6, 3]</div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Advanced Patterns */}
              <motion.div
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    🚀 Advanced Haptic Patterns
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <motion.button
                      className="btn btn-sm btn-ghost"
                      onClick={() => haptic.pattern([10, 20, 30, 40, 50])}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.pattern([10, 20, 30, 40, 50])}
                    >
                      📈 Ascending
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-ghost"
                      onClick={() => haptic.pattern([50, 40, 30, 20, 10])}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.pattern([50, 40, 30, 20, 10])}
                    >
                      📉 Descending
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-ghost"
                      onClick={() => haptic.pattern([20, 0, 20, 0, 20])}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.pattern([20, 0, 20, 0, 20])}
                    >
                      💓 Pulsing
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-ghost"
                      onClick={() =>
                        haptic.pattern([100, 0, 100, 0, 100, 0, 100])
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() =>
                        haptic.pattern([100, 0, 100, 0, 100, 0, 100])
                      }
                    >
                      📡 Morse-like
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Special Effects */}
              <motion.div
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onAnimationStart={() => haptic.light()}
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    ✨ Special Haptic Effects
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <motion.button
                      className="btn btn-sm btn-outline btn-info"
                      onClick={() => haptic.notification()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.notification()}
                    >
                      🔔 Notification
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-outline btn-warning"
                      onClick={() => haptic.alert()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.alert()}
                    >
                      ⚠️ Alert
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-outline btn-success"
                      onClick={() => haptic.tick()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.tick()}
                    >
                      ✅ Tick
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-outline btn-primary"
                      onClick={() => haptic.double()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.double()}
                    >
                      👆👆 Double
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-outline btn-secondary"
                      onClick={() => haptic.triple()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onTap={() => haptic.triple()}
                    >
                      👆👆👆 Triple
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Haptic Info */}
              <motion.div
                className="alert alert-info"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                onAnimationStart={() => haptic.light()}
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
                <div>
                  <h3 className="font-bold">Haptic Feedback Tips</h3>
                  <div className="text-sm">
                    • <strong>Light haptics</strong> for subtle interactions
                    <br />• <strong>Medium haptics</strong> for confirmations
                    <br />• <strong>Heavy haptics</strong> for important actions
                    <br />• <strong>Patterns</strong> for unique experiences
                    <br />• <strong>Custom patterns</strong> for brand-specific
                    feedback
                  </div>
                </div>
              </motion.div>
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
            onAnimationStart={() => haptic.modal()}
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
                onAnimationStart={() => haptic.light()}
              >
                Hello from daisyUI Modal! 🎉
              </motion.h3>
              <motion.p
                className="py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onAnimationStart={() => haptic.light()}
              >
                This modal demonstrates daisyUI's modal component with beautiful
                Framer Motion animations, haptic feedback, and React state
                management.
              </motion.p>
              <motion.div
                className="modal-action"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onAnimationStart={() => haptic.light()}
              >
                <motion.button
                  className="btn"
                  onClick={handleModalClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onTap={() => haptic.button()}
                >
                  Close
                </motion.button>
                <motion.button
                  className="btn btn-primary"
                  onClick={handleModalClose}
                  whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                  whileTap={{ scale: 0.95 }}
                  onTap={() => haptic.button()}
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
