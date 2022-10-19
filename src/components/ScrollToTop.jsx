import React, { useState, useEffect } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

import "../index.css";

const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showBottomBtn, setShowBottomBtn] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
        setShowBottomBtn(true);
      } else {
        setShowTopBtn(false);
        setShowBottomBtn(false);
      }
      if (window.scrollY > 20) {
        setShowBottomBtn(true);
      } else {
        setShowBottomBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const goToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };
  return (
    <div className="top-to-btm">
      {" "}
      {showTopBtn && (
        <FaAngleUp className="icon-position icon-style" onClick={goToTop} />
      )}{" "}
      {showBottomBtn && (
        <FaAngleDown
          className="icon-position2 icon-style"
          onClick={goToBottom}
        />
      )}{" "}
    </div>
  );
};
export default ScrollToTop;
