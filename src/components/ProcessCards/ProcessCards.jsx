"use client";
import "./ProcessCards.css";

import { useGSAP } from "@gsap/react";
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
    const processCards = document.querySelectorAll(
      ".process__card, .process-card"
    );

    processCards.forEach((card, index) => {
      if (index < processCards.length - 1) {
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: processCards[processCards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
          id: `card-pin-${index}`,
        });
      }

      if (index < processCards.length - 1) {
        ScrollTrigger.create({
          trigger: processCards[index + 1],
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            const scale = 1 - progress * 0.25;
            const rotation = (index % 2 === 0 ? 5 : -5) * progress;
            const afterOpacity = progress;

            gsap.set(card, {
              scale: scale,
              rotation: rotation,
              "--after-opacity": afterOpacity,
            });
          },
        });
      }
    });
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
                <img src={cardData.image} alt="" />
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
