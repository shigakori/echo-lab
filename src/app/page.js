"use client";
import "./home.css";
import { useState, useEffect } from "react";

import DynamicBackground from "@/components/DynamicBackground/DynamicBackground";
import { prefixPath } from "@/lib/asset";
import Copy from "@/components/Copy/Copy";
import BtnLink from "@/components/BtnLink/BtnLink";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dynamicBackgroundKey, setDynamicBackgroundKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");
    if (!hasSeenPreloader) {
      sessionStorage.setItem("hasSeenPreloader", "true");
      setShowPreloader(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      setDynamicBackgroundKey((prev) => prev + 1);

      const timer = setTimeout(() => {
        setDynamicBackgroundKey((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      const handleRouteChange = () => {
        if (window.location.pathname === "/") {
          console.log(
            "Home: Route change detected, reinitializing DynamicBackground"
          );
          setDynamicBackgroundKey((prev) => prev + 1);
        }
      };

      const handleFocus = () => {
        if (window.location.pathname === "/") {
          console.log("Home: Focus detected, reinitializing DynamicBackground");
          setDynamicBackgroundKey((prev) => prev + 1);
        }
      };

      const handleVisibilityChange = () => {
        if (!document.hidden && window.location.pathname === "/") {
          console.log(
            "Home: Visibility change detected, reinitializing DynamicBackground"
          );
          setDynamicBackgroundKey((prev) => prev + 1);
        }
      };

      let currentUrl = window.location.href;
      const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          if (window.location.pathname === "/") {
            handleRouteChange();
          }
        }
      });

      observer.observe(document, { subtree: true, childList: true });

      if (window.next && window.next.router && window.next.router.events) {
        window.next.router.events.on("routeChangeComplete", handleRouteChange);
      }

      window.addEventListener("focus", handleFocus);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        observer.disconnect();
        if (window.next && window.next.router && window.next.router.events) {
          window.next.router.events.off(
            "routeChangeComplete",
            handleRouteChange
          );
        }
        window.removeEventListener("focus", handleFocus);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    }
  }, [isClient]);

  useGSAP(() => {
    const heroLink = document.querySelector(".hero-link");
    const animationDelay = showPreloader ? 6.2 : 0.9;

    if (showPreloader) {
      const tl = gsap.timeline({
        delay: 0.3,
        defaults: {
          ease: "hop",
        },
      });

      const counts = document.querySelectorAll(".preloader__count, .count");
      const progressBar = document.querySelector(
        ".preloader__progress, .progress-bar"
      );
      const preloaderOverlay = document.querySelector(
        ".preloader, .preloader-overlay"
      );

      const progressTl = gsap.timeline({
        delay: 0.3,
      });

      counts.forEach((count, index) => {
        const digits = count.querySelectorAll(
          ".preloader__digit h1, .digit h1"
        );

        tl.to(
          digits,
          {
            y: "0%",
            duration: 1,
            stagger: 0.075,
          },
          index * 1
        );

        if (index < counts.length) {
          tl.to(
            digits,
            {
              y: "-120%",
              duration: 1,
              stagger: 0.075,
            },
            index * 1 + 1
          );
        }

        progressTl.to(
          progressBar,
          {
            scaleY: (index + 1) / counts.length,
            duration: 1,
            ease: "hop",
          },
          index * 1
        );
      });

      progressTl
        .set(progressBar, {
          transformOrigin: "top",
        })
        .to(progressBar, {
          scaleY: 0,
          duration: 0.75,
          ease: "hop",
        })
        .to(preloaderOverlay, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            preloaderOverlay.style.display = "none";
          },
        });
    }

    if (heroLink) {
      gsap.set(heroLink, { y: 30, opacity: 0 });

      gsap.to(heroLink, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: animationDelay,
        ease: "power4.out",
      });
    }
  }, [showPreloader]);

  if (!isClient) {
    return (
      <section className="hero" suppressHydrationWarning>
        <DynamicBackground
          key={`home-${dynamicBackgroundKey}`}
          logoPath={prefixPath("/images/logos/logo_light.png")}
        />

        <div className="hero__content">
          <div className="hero__header">
            <div className="hero__header-col--lg"></div>
            <div className="hero__header-col--sm">
              <Copy animateOnScroll={false} delay={0.9}>
                <h3>
                  Systems thinking and creative execution brought into web
                  development for consistent outcomes.
                </h3>
              </Copy>
            </div>
          </div>

          <div className="hero__footer">
            <div className="hero__footer-col--lg">
              <Copy animateOnScroll={false} delay={0.9}>
                <p className="sm caps mono">Studios</p>
                <p className="sm caps mono">Toronto and Copenhagen</p>
              </Copy>
            </div>
            <div className="hero__footer-col--sm">
              <div className="hero__tags">
                <Copy animateOnScroll={false} delay={0.9}>
                  <p className="sm caps mono">Web Systems</p>
                  <p className="sm caps mono">Interface Design</p>
                  <p className="sm caps mono">Creative Development</p>
                  <p className="sm caps mono">End to End Delivery</p>
                </Copy>
              </div>

              <div className="hero-link">
                <BtnLink route="/contact" label="contact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {showPreloader && (
        <div className="preloader">
          <div className="preloader__progress"></div>
          <div className="preloader__counter">
            <div className="preloader__count">
              <div className="preloader__digit">
                <h1>0</h1>
              </div>
              <div className="preloader__digit">
                <h1>0</h1>
              </div>
            </div>
            <div className="preloader__count">
              <div className="preloader__digit">
                <h1>2</h1>
              </div>
              <div className="preloader__digit">
                <h1>7</h1>
              </div>
            </div>
            <div className="preloader__count">
              <div className="preloader__digit">
                <h1>6</h1>
              </div>
              <div className="preloader__digit">
                <h1>5</h1>
              </div>
            </div>
            <div className="preloader__count">
              <div className="preloader__digit">
                <h1>9</h1>
              </div>
              <div className="preloader__digit">
                <h1>8</h1>
              </div>
            </div>
            <div className="preloader__count">
              <div className="preloader__digit">
                <h1>9</h1>
              </div>
              <div className="preloader__digit">
                <h1>9</h1>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="hero" suppressHydrationWarning>
        <DynamicBackground
          key={`home-${dynamicBackgroundKey}`}
          logoPath={prefixPath("/images/logos/logo_light.png")}
        />

        <div className="hero__content">
          <div className="hero__header">
            <div className="hero__header-col--lg"></div>
            <div className="hero__header-col--sm">
              <Copy animateOnScroll={false} delay={showPreloader ? 6.2 : 0.9}>
                <h3>
                  Systems thinking and creative execution brought into web
                  development for consistent outcomes.
                </h3>
              </Copy>
            </div>
          </div>

          <div className="hero__footer">
            <div className="hero__footer-col--lg">
              <Copy animateOnScroll={false} delay={showPreloader ? 6.2 : 0.9}>
                <p className="sm caps mono">Studios</p>
                <p className="sm caps mono">Toronto and Copenhagen</p>
              </Copy>
            </div>
            <div className="hero__footer-col--sm">
              <div className="hero__tags">
                <Copy animateOnScroll={false} delay={showPreloader ? 6.2 : 0.9}>
                  <p className="sm caps mono">Web Systems</p>
                  <p className="sm caps mono">Interface Design</p>
                  <p className="sm caps mono">Creative Development</p>
                  <p className="sm caps mono">End to End Delivery</p>
                </Copy>
              </div>

              <div className="hero-link">
                <BtnLink route="/contact" label="contact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
