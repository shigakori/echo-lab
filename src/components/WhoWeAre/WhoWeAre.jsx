"use client";
import "./WhoWeAre.css";

import { useGSAP } from "@gsap/react";
import { prefixPath } from "@/lib/asset";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WhoWeAre = () => {
  useGSAP(() => {
    const setup = (mobile = false) => {
      const whoweareScroll = document.querySelector(
        ".whoweare__scroll, .whoweare-scroll"
      );
      if (!whoweareScroll) return [];
      const containerWidth = whoweareScroll.offsetWidth;
      const viewportWidth = window.innerWidth;

      const maxTranslateX = Math.max(containerWidth - viewportWidth, 0);
      const endLen = mobile ? window.innerHeight * 4 : window.innerHeight * 6;

      const images = [
        { id: "#whoweare-img-1", endTranslateX: mobile ? -400 : -800 },
        { id: "#whoweare-img-2", endTranslateX: mobile ? -600 : -1200 },
        { id: "#whoweare-img-3", endTranslateX: mobile ? -300 : -600 },
        { id: "#whoweare-img-4", endTranslateX: mobile ? -500 : -1000 },
        { id: "#whoweare-img-5", endTranslateX: mobile ? -450 : -900 },
      ];

      const triggers = [];

      triggers.push(
        ScrollTrigger.create({
          trigger: ".whoweare",
          start: "top bottom",
          end: `bottom+=${window.innerHeight * 2} top`,
          scrub: mobile ? 0.6 : 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const clipPathValue = Math.min(progress * 100, 100);
            gsap.set(".whoweare__container, .whoweare-container", {
              clipPath: `circle(${clipPathValue}% at 50% 50%)`,
            });
          },
          onComplete: () => {
            gsap.set(".whoweare__container, .whoweare-container", {
              clipPath: `circle(100% at 50% 50%)`,
            });
          },
        })
      );

      triggers.push(
        ScrollTrigger.create({
          trigger: ".whoweare",
          start: "top top",
          end: `+=${endLen}`,
          pin: true,
          pinSpacing: true,
          scrub: mobile ? 0.6 : 1,
          anticipatePin: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const fadeProgress = Math.min(progress / 0.2, 1);
            const scale = (mobile ? 0.92 : 0.9) + 0.1 * fadeProgress;
            const adjustedProgress = Math.max((progress - 0.2) / 0.8, 0);
            const translateX = -Math.min(
              adjustedProgress * maxTranslateX,
              maxTranslateX
            );

            gsap.set(whoweareScroll, {
              opacity: fadeProgress,
              scale,
              x: translateX,
            });
          },
        })
      );

      images.forEach((img) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: ".whoweare",
            start: "top top",
            end: `+=${endLen}`,
            scrub: mobile ? 0.6 : 1,
            onUpdate: (self) => {
              const progress = self.progress;
              if (progress >= 0.3) {
                const adjustedProgress = (progress - 0.3) / (1 - 0.3);
                gsap.set(img.id, {
                  x: `${img.endTranslateX * adjustedProgress}px`,
                });
              }
            },
          })
        );
      });

      return triggers;
    };

    const waitForImages = () => {
      return new Promise((resolve) => {
        const nodeList = document.querySelectorAll(
          ".whoweare__scroll img, .whoweare-scroll img"
        );
        const images = Array.from(nodeList);
        if (images.length === 0) {
          resolve();
          return;
        }
        let loadedCount = 0;
        const checkDone = () => {
          loadedCount += 1;
          if (loadedCount >= images.length) resolve();
        };
        images.forEach((img) => {
          if (img.complete) {
            checkDone();
          } else {
            const onLoad = () => {
              img.removeEventListener("load", onLoad);
              img.removeEventListener("error", onLoad);
              checkDone();
            };
            img.addEventListener("load", onLoad);
            img.addEventListener("error", onLoad);
          }
        });
        // safety timeout
        setTimeout(resolve, 1200);
      });
    };

    let currentTriggers = [];
    const init = () => {
      const mql = window.matchMedia("(max-width: 999px)");
      currentTriggers = setup(mql.matches);
      const onChange = () => {
        currentTriggers.forEach((t) => t.kill());
        currentTriggers = setup(mql.matches);
        try {
          ScrollTrigger.refresh();
        } catch {}
      };
      mql.addEventListener("change", onChange);
      // keep reference for cleanup
      return () => mql.removeEventListener("change", onChange);
    };

    let removeMqlListener = () => {};
    waitForImages().then(() => {
      removeMqlListener = init();
      try {
        ScrollTrigger.refresh();
      } catch {}
    });

    const onWindowLoad = () => {
      try {
        ScrollTrigger.refresh();
      } catch {}
    };
    window.addEventListener("load", onWindowLoad, { once: true });

    return () => {
      window.removeEventListener("load", onWindowLoad);
      removeMqlListener();
      currentTriggers.forEach((t) => t.kill());
    };
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
