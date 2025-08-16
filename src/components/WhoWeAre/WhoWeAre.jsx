"use client";
import "./WhoWeAre.css";

import { useGSAP } from "@gsap/react";
import { prefixPath } from "@/lib/asset";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WhoWeAre = () => {
  useGSAP(() => {
    const whoweareScroll = document.querySelector(
      ".whoweare__scroll, .whoweare-scroll"
    );
    if (!whoweareScroll) return;
    const containerWidth = whoweareScroll.offsetWidth;
    const viewportWidth = window.innerWidth;

    const maxTranslateX = containerWidth - viewportWidth;
    const targetProgress = 1;
    const maxTranslateAtTarget = maxTranslateX / targetProgress;

    const images = [
      { id: "#whoweare-img-1", endTranslateX: -800 },
      { id: "#whoweare-img-2", endTranslateX: -1200 },
      { id: "#whoweare-img-3", endTranslateX: -600 },
      { id: "#whoweare-img-4", endTranslateX: -1000 },
      { id: "#whoweare-img-5", endTranslateX: -900 },
    ];

    ScrollTrigger.create({
      trigger: ".whoweare",
      start: "top bottom",
      end: `bottom+=${window.innerHeight * 2} top`,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const clipPathValue = Math.min(progress * 100, 100);
        gsap.to(".whoweare__container, .whoweare-container", {
          clipPath: `circle(${clipPathValue}% at 50% 50%)`,
          duration: 0.2,
          ease: "none",
        });
      },
      onComplete: () => {
        gsap.set(".whoweare__container, .whoweare-container", {
          clipPath: `circle(100% at 50% 50%)`,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".whoweare",
      start: "top top",
      end: `+=${window.innerHeight * 6}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      anticipatePin: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;

        const fadeProgress = Math.min(progress / 0.2, 1);
        const scale = 0.9 + 0.1 * fadeProgress;
        const adjustedProgress = Math.max((progress - 0.2) / 0.8, 0);
        const translateX = -Math.min(
          adjustedProgress * maxTranslateAtTarget,
          maxTranslateX
        );

        gsap.to(whoweareScroll, {
          opacity: fadeProgress,
          scale,
          x: translateX,
          duration: 0.2,
          ease: "none",
        });
      },
    });

    images.forEach((img) => {
      ScrollTrigger.create({
        trigger: ".whoweare",
        start: "top top",
        end: `+=${window.innerHeight * 6}`,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          if (progress >= 0.3) {
            const adjustedProgress = (progress - 0.3) / (1 - 0.3);
            gsap.set(img.id, {
              x: `${img.endTranslateX * adjustedProgress}px`,
            });
          }
        },
      });
    });
  }, []);

  return (
    <section className="whoweare" suppressHydrationWarning>
      <div className="whoweare__container">
        <div className="whoweare__scroll">
          <div className="whoweare__header">
            <h1 className="whoweare__header-title">echo lab</h1>
          </div>

          <div className="whoweare__img" id="whoweare-img-1">
            <img src={prefixPath("/images/who-we-are/team-1.jpg")} alt="" />
          </div>
          <div className="whoweare__img" id="whoweare-img-2">
            <img src={prefixPath("/images/who-we-are/team-2.jpg")} alt="" />
          </div>
          <div className="whoweare__img" id="whoweare-img-3">
            <img src={prefixPath("/images/who-we-are/team-3.jpg")} alt="" />
          </div>
          <div className="whoweare__img" id="whoweare-img-4">
            <img src={prefixPath("/images/who-we-are/team-4.jpg")} alt="" />
          </div>
          <div className="whoweare__img" id="whoweare-img-5">
            <img src={prefixPath("/images/who-we-are/team-5.jpg")} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
