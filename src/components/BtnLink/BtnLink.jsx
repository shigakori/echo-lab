"use client";
import { useTransitionRouter } from "next-view-transitions";
import { IoMdArrowForward, IoMdArrowBack } from "react-icons/io";

import "./BtnLink.css";

const BtnLink = ({ label, route, dark = false, direction = "forward" }) => {
  const router = useTransitionRouter();

  function slideInOut() {
    window.scrollTo(0, 0);

    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0) scale(1)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-30%) scale(0.90)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }

  const handleClick = (e) => {
    e.preventDefault();
    router.push(route, {
      onTransitionReady: slideInOut,
    });
  };

  return (
    <a
      className={`sm caps mono ${
        dark ? "btn--dark link-dark" : "btn--light link-light"
      }`}
      href={route}
      onClick={handleClick}
    >
      <div
        className={`btn anime-link ${
          dark ? "btn--dark anime-link-dark" : "btn--light anime-link-light"
        }`}
      >
        <div className="btn__label anime-link-label">
          <p className="sm caps mono">
            <span>{label}</span>
          </p>
        </div>
        <div
          className={`btn__icon anime-link-icon ${
            direction === "back" ? "btn__icon--back anime-link-icon--back" : ""
          }`}
        >
          {direction === "back" ? (
            <IoMdArrowBack color={dark ? "#fff" : "#000"} />
          ) : (
            <IoMdArrowForward color={dark ? "#fff" : "#000"} />
          )}
        </div>
      </div>
    </a>
  );
};

export default BtnLink;
