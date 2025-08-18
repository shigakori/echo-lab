"use client";
import "./studio.css";
import { useRef, useState, useEffect } from "react";

import Copy from "@/components/Copy/Copy";
import BtnLink from "@/components/BtnLink/BtnLink";
import WhoWeAre from "@/components/WhoWeAre/WhoWeAre";
import ProcessCards from "@/components/ProcessCards/ProcessCards";
import Footer from "@/components/Footer/Footer";
import { prefixPath } from "@/lib/asset";

import gsap from "gsap";
// SplitText will be dynamically loaded with a fallback stub
import { SplitText as SplitTextStub } from "@/lib/splitTextStub";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const page = () => {
  const studioRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useGSAP(
    () => {
      if (!isClient || !studioRef.current) return;
      const run = async () => {
        const studioHeroH1 = studioRef.current.querySelector(
          ".studio__hero-title, .studio-hero h1"
        );
        const studioHeroImgWrapper = studioRef.current.querySelector(
          ".studio__hero-image-wrapper, .studio-hero-img-wrapper"
        );
        const missionLinkWrapper = studioRef.current.querySelector(
          ".studio__mission-link, .mission-link"
        );
        const whoWeAreSection = studioRef.current.querySelector(".whoweare");

        // wait for fonts to avoid layout shift on first paint
        try {
          if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
          }
        } catch {}

        if (studioHeroH1) {
          let SplitTextMod = null;
          try {
            SplitTextMod = (await import("gsap/SplitText")).SplitText;
          } catch (_) {
            SplitTextMod = SplitTextStub;
          }

          const split = SplitTextMod.create(studioHeroH1, {
            type: "chars",
            charsClass: "char++",
          });

          split.chars.forEach((char) => {
            const wrapper = document.createElement("span");
            wrapper.className = "char-mask";
            wrapper.style.overflow = "hidden";
            wrapper.style.display = "inline-block";
            char.parentNode.insertBefore(wrapper, char);
            wrapper.appendChild(char);
          });

          gsap.set(split.chars, { y: "100%" });

          gsap.to(split.chars, {
            y: "0%",
            duration: 0.8,
            stagger: 0.2,
            delay: 0.85,
            ease: "power3.out",
          });
        }

        if (studioHeroImgWrapper) {
          gsap.set(studioHeroImgWrapper, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });

          gsap.to(studioHeroImgWrapper, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            duration: 1,
            delay: 1,
            ease: "power3.out",
          });
        }

        if (whoWeAreSection) {
          gsap.set(whoWeAreSection, {
            opacity: 0,
            y: 50,
          });

          ScrollTrigger.create({
            trigger: whoWeAreSection,
            start: "top 80%",
            once: true,
            onEnter: () => {
              gsap.to(whoWeAreSection, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
              });
            },
          });
        }

        if (missionLinkWrapper) {
          gsap.set(missionLinkWrapper, { y: 30, opacity: 0 });

          ScrollTrigger.create({
            trigger: missionLinkWrapper.closest(
              ".studio__mission-copy, .mission-intro-copy"
            ),
            start: "top 75%",
            once: true,
            onEnter: () => {
              gsap.to(missionLinkWrapper, {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 1.2,
                ease: "power3.out",
              });
            },
          });
        }

        try {
          ScrollTrigger.refresh();
        } catch {}
      };
      run();

      const refresh = () => {
        try {
          ScrollTrigger.refresh();
        } catch {}
      };
      const waitForImages = () => {
        return new Promise((resolve) => {
          const nodeList = studioRef.current.querySelectorAll("img");
          const images = Array.from(nodeList);
          if (images.length === 0) {
            resolve();
            return;
          }
          let loaded = 0;
          const done = () => {
            loaded += 1;
            if (loaded >= images.length) resolve();
          };
          images.forEach((img) => {
            if (img.complete) {
              done();
            } else {
              const on = () => {
                img.removeEventListener("load", on);
                img.removeEventListener("error", on);
                done();
              };
              img.addEventListener("load", on);
              img.addEventListener("error", on);
            }
          });
          setTimeout(resolve, 1200);
        });
      };

      const raf = requestAnimationFrame(refresh);
      waitForImages().then(refresh);
      window.addEventListener("load", refresh, { once: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("load", refresh);
      };
    },
    { dependencies: [isClient] }
  );

  return (
    <>
      <div className="studio" ref={studioRef} suppressHydrationWarning>
        <section className="studio__hero">
          <h1 className="caps studio__hero-title">echo</h1>
        </section>

        <section className="studio__hero-image">
          <div className="studio__hero-image-wrapper">
            <img src={prefixPath("/images/studio/hero.jpeg")} alt="" />
          </div>
        </section>

        <section className="studio__header">
          <div className="studio__header-copy">
            <Copy>
              <h2>
                We believe in the power of thoughtful design and purposeful
                technology. Every project begins with understanding and ends
                with impact, creating digital experiences that serve both users
                and business goals.
              </h2>
            </Copy>
          </div>
        </section>

        <WhoWeAre />

        <section className="studio__mission">
          <div className="studio__mission-col studio__mission-col--sm"></div>
          <div className="studio__mission-col studio__mission-col--lg">
            <div className="studio__mission-copy">
              <Copy>
                <h3>
                  We craft digital spaces where every detail matters. Our work
                  is built on deep understanding of user experience, thoughtful
                  architecture, and flawless execution.
                </h3>
                <br />
                <h3>
                  We believe in the power of minimalism and functionality. Each
                  project is a balance between aesthetics and efficiency,
                  between innovation and proven solutions.
                </h3>
              </Copy>

              <div className="studio__mission-link">
                <BtnLink route="/work" label="View Work" dark />
              </div>
            </div>
          </div>
        </section>

        <ProcessCards />

        <section className="studio__recognition">
          <div className="studio__recognition-copy">
            <Copy>
              <p className="sm caps">(Recognition)</p>
              <br />
              <h2>
                Our approach has earned recognition from industry leaders and
                design communities for its precision, innovation, and lasting
                impact. We create solutions that transcend trends and deliver
                measurable results.
              </h2>
            </Copy>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default page;
