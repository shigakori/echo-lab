"use client";
import "./ProcessCards.css";

import { useGSAP } from "@gsap/react";
import { prefixPath } from "@/lib/asset";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ProcessCards = () => {
  const processCardsData = [
    {
      index: "01",
      title: "Principles",
      image: "/images/who-we-are/team-1.jpg",
      description:
        "We start with purpose and meaning. Every design decision is guided by core values—functionality, elegance, and thoughtful execution.",
    },
    {
      index: "02",
      title: "Approach",
      image: "/images/who-we-are/team-2.jpg",
      description:
        "Our methodology is collaborative and strategic. We focus on essential elements and create scalable solutions that grow with purpose.",
    },
    {
      index: "03",
      title: "Practice",
      image: "/images/who-we-are/team-3.jpg",
      description:
        "We bridge the gap between creativity and technology. Every element is crafted with attention to detail, harmony, and technical excellence.",
    },
    {
      index: "04",
      title: "Vision",
      image: "/images/who-we-are/team-4.jpg",
      description:
        "We believe digital experiences should be intuitive and meaningful. Our goal is to build solutions that remain relevant and valuable over time.",
    },
  ];

  useGSAP(() => {
    const isMobile = window.matchMedia("(max-width: 999px)").matches;
    const container = document.querySelector(
      ".process.process-cards, .process-cards"
    );
    if (!container) return;

    // hide until container is near viewport to prevent early flash over pin sections above
    gsap.set(container, { opacity: 0 });
    const revealTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(container, { opacity: 1, duration: 0.4, ease: "power2.out" });
      },
    });

    const setup = () => {
      const cards = container.querySelectorAll(".process__card, .process-card");
      const localTriggers = [];

      cards.forEach((card, index) => {
        const last = index === cards.length - 1;
        if (!last) {
          localTriggers.push(
            ScrollTrigger.create({
              trigger: card,
              start: "top top",
              endTrigger: cards[cards.length - 1],
              end: "top top",
              pin: true,
              pinSpacing: false,
              pinnedContainer: container,
              id: `card-pin-${index}`,
              scrub: isMobile ? 0.6 : 1,
            })
          );

          localTriggers.push(
            ScrollTrigger.create({
              trigger: cards[index + 1],
              start: "top bottom",
              end: "top top",
              scrub: isMobile ? 0.6 : 1,
              onUpdate: (self) => {
                const progress = self.progress;
                const scale = 1 - progress * (isMobile ? 0.15 : 0.25);
                const rotation =
                  (index % 2 === 0 ? (isMobile ? 3 : 5) : isMobile ? -3 : -5) *
                  progress;
                const afterOpacity = progress;
                gsap.set(card, {
                  scale,
                  rotation,
                  "--after-opacity": afterOpacity,
                });
              },
            })
          );
        }
      });

      return () => localTriggers.forEach((t) => t.kill());
    };

    let killSetup = () => {};

    const whoweare = document.querySelector(".whoweare");
    if (whoweare) {
      ScrollTrigger.create({
        trigger: whoweare,
        start: "bottom bottom",
        once: true,
        onEnter: () => {
          killSetup = setup();
          try {
            ScrollTrigger.refresh();
          } catch {}
        },
      });
    } else {
      killSetup = setup();
    }

    // ensure proper recalculation on load to avoid first-visit pin glitches
    const refresh = () => {
      try {
        ScrollTrigger.refresh();
      } catch {}
    };
    const raf = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      revealTrigger.kill();
      killSetup();
    };
  }, []);

  return (
    <div className="process process-cards">
      {processCardsData.map((cardData, index) => (
        <div key={index} className="process__card process-card">
          <div className="process__card-index process-card-index">
            <h1>{cardData.index}</h1>
          </div>
          <div className="process__card-content process-card-content">
            <div className="process__card-content-wrapper process-card-content-wrapper">
              <h1 className="process__card-header process-card-header">
                {cardData.title}
              </h1>

              <div className="process__card-img process-card-img">
                <img src={prefixPath(cardData.image)} alt="" />
              </div>

              <div className="process__card-copy process-card-copy">
                <div className="process__card-copy-title process-card-copy-title">
                  <p className="caps">(About the state)</p>
                </div>
                <div className="process__card-copy-description process-card-copy-description">
                  <p>{cardData.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessCards;
