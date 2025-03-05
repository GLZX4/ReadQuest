import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/header.css";

const waveVariants = {
  rest: { y: 0 },
  hover: (i) => ({
    y: [-2, 2, -2, 0], // Subtle movement
    transition: {
      duration: 0.8, // Slower wave effect
      repeat: Infinity,
      repeatType: "mirror",
      delay: i * 0.1, // Creates a wave effect
      ease: "easeInOut",
    },
  }),
};

function HeaderText() {
  const title = "ReadQuest";

  return (
    <Link to="/" className="logo-link">
      <motion.span
        className="ReadQuest-Title"
        initial="rest"
        whileHover="hover"
        animate="rest"
        style={{ display: "inline-flex", gap: "2px", alignItems: "center" }} // Prevents shifting
      >
        {title.split("").map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={waveVariants}
            style={{ display: "inline-block" }} // Ensures per-letter animation
            className={i >= 4 ? "ReadQuest-Purple" : ""} // "Quest" part gets purple
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </Link>
  );
}

export default HeaderText;
