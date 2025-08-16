"use client";
import "./Copy.css";
import React, { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Copy({ children, animateOnScroll = true, delay = 0 }) {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const splitRefs = useRef([]);
  const lines = useRef([]);

  const waitForFonts = async () => {
    try {
      await document.fonts.ready;

      const customFonts = ["nm", "DM Mono"];
      const fontCheckPromises = customFonts.map((fontFamily) => {
        return document.fonts.check(`16px ${fontFamily}`);
      });

      await Promise.all(fontCheckPromises);
      await new Promise((resolve) => setTimeout(resolve, 100));

      return true;
    } catch (error) {
      console.warn("Font loading check failed, proceeding anyway:", error);
      await new Promise((resolve) => setTimeout(resolve, 200));
      return true;
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const initializeSplitText = async () => {
        await waitForFonts();

        if (!containerRef.current) return;

        splitRefs.current = [];
        lines.current = [];
        elementRefs.current = [];

        // dynamic import SplitText (real plugin locally; stub on GH Pages)
        let SplitTextMod = null;
        try {
          SplitTextMod = (await import("gsap/SplitText")).SplitText;
        } catch (_) {
          SplitTextMod = null;
        }

        let elements = [];
        if (containerRef.current.hasAttribute("data-copy-wrapper")) {
          elements = Array.from(containerRef.current.children);
        } else {
          elements = [containerRef.current];
        }

        elements.forEach((element) => {
          elementRefs.current.push(element);

          let currentLines = [];
          if (SplitTextMod && typeof SplitTextMod.create === "function") {
            const split = SplitTextMod.create(element, {
              type: "lines",
              mask: "lines",
              linesClass: "copy__line line++",
              lineThreshold: 0.1,
            });
            splitRefs.current.push(split);
            currentLines = split.lines || [];
          }

          if (!currentLines || currentLines.length === 0) {
            // fallback: animate the element itself (no DOM restructuring to avoid layout shift)
            const anim = () => {
              const cfg = {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay,
              };
              if (animateOnScroll) {
                gsap.fromTo(
                  element,
                  { y: 40, opacity: 0 },
                  {
                    ...cfg,
                    duration: 0.9,
                    scrollTrigger: {
                      trigger: element,
                      start: "top 85%",
                      once: true,
                    },
                  }
                );
              } else {
                gsap.fromTo(element, { y: 40, opacity: 0 }, cfg);
              }
            };
            anim();
            return; // skip pushing lines for this element
          }

          lines.current.push(...currentLines);
        });

        // animate inner targets (firstElementChild of each line) to preserve mask layout
        const animateTargets = lines.current.map((line) =>
          line && line.firstElementChild ? line.firstElementChild : line
        );

        // ensure initial state for targets that might not have CSS applied
        gsap.set(animateTargets, { y: "100%" });

        const animationProps = {
          y: "0%",
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: delay,
        };

        if (animateTargets.length && animateOnScroll) {
          gsap.to(animateTargets, {
            ...animationProps,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              once: true,
            },
          });
        } else if (animateTargets.length) {
          gsap.to(animateTargets, animationProps);
        }
      };

      initializeSplitText();

      return () => {
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
