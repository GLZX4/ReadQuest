import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../../styles/header.css";

const waveVariants = {
  rest: { y: 0 },
  hover: (i) => ({
    y: [-2, 2, -2, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "mirror",
      delay: i * 0.1, 
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
            style={{ display: "inline-block" }} 
            className={i >= 4 ? "ReadQuest-Purple" : ""} 
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </Link>
  );
}

export default HeaderText;
