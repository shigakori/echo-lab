"use client";
import "./work.css";
import { portfolio } from "./portfolio";
import { useRef, useState, useEffect } from "react";

import Copy from "@/components/Copy/Copy";
import Footer from "@/components/Footer/Footer";
import { prefixPath } from "@/lib/asset";

import { useTransitionRouter } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const page = () => {
  const workRef = useRef(null);
  const router = useTransitionRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function slideInOut() {
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

  const navigateToProject = (projectId) => {
    router.push(`/work/${projectId}`, {
      onTransitionReady: slideInOut,
    });
  };

  const scrollToYear = (yearIndex) => {
    if (!isClient || !workRef.current) return;

    const workContainers = workRef.current.querySelectorAll(".work-container");
    if (workContainers[yearIndex]) {
      const targetContainer = workContainers[yearIndex];
      const targetRect = targetContainer.getBoundingClientRect();
      const currentScroll = window.pageYOffset;
      const targetScroll =
        currentScroll +
        targetRect.top -
        window.innerHeight / 2 +
        targetRect.height / 2;

      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 1.5,
        ease: "power3.inOut",
      });
    }
  };

  useGSAP(
    () => {
      if (!isClient || !workRef.current) return;

      const workContainers = workRef.current.querySelectorAll(
        ".work__container, .work-container"
      );
      const yearIndices = document.querySelectorAll(
        ".work__year-index, .year-index"
      );
      let initialAnimationComplete = false;

      const workProjects = workRef.current.querySelectorAll(
        ".work__project, .work-project"
      );
      gsap.set(workProjects, { y: 100, opacity: 0 });
      gsap.to(workProjects, {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        delay: 0.85,
        duration: 1,
        ease: "power3.out",
      });

      workContainers.forEach((container, index) => {
        ScrollTrigger.create({
          trigger: container,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => {
            if (!initialAnimationComplete) return;

            yearIndices.forEach((yearIndex, i) => {
              yearIndex.classList.remove("active");
              const highlighter = yearIndex.querySelector(
                ".work__year-index-highlighter, .year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "power2.out",
              });
            });

            if (yearIndices[index]) {
              yearIndices[index].classList.add("active");
              const highlighter = yearIndices[index].querySelector(
                ".work__year-index-highlighter, .year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
          onEnterBack: () => {
            if (!initialAnimationComplete) return;

            yearIndices.forEach((yearIndex, i) => {
              yearIndex.classList.remove("active");
              const highlighter = yearIndex.querySelector(
                ".year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 0,
                transformOrigin: "right",
                duration: 0.3,
                ease: "power2.out",
              });
            });

            if (yearIndices[index]) {
              yearIndices[index].classList.add("active");
              const highlighter = yearIndices[index].querySelector(
                ".year-index-highlighter"
              );
              gsap.to(highlighter, {
                scaleX: 1,
                transformOrigin: "left",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          },
        });
      });

      yearIndices.forEach((yearIndex) => {
        const highlighter = yearIndex.querySelector(
          ".work__year-index-highlighter, .year-index-highlighter"
        );
        gsap.set(highlighter, { scaleX: 0 });
      });

      setTimeout(() => {
        let activeIndex = 0;
        workContainers.forEach((container, index) => {
          const rect = container.getBoundingClientRect();
          const containerCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;

          if (containerCenter <= viewportCenter) {
            activeIndex = index;
          }
        });

        if (yearIndices[activeIndex]) {
          yearIndices[activeIndex].classList.add("active");
          const highlighter = yearIndices[activeIndex].querySelector(
            ".work__year-index-highlighter, .year-index-highlighter"
          );
          gsap.to(highlighter, {
            scaleX: 1,
            transformOrigin: "left",
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              initialAnimationComplete = true;
            },
          });
        }
      }, 1000);

      if (window.innerWidth > 1000) {
        const workYears = workRef.current.querySelectorAll(
          ".work__year, .work-year"
        );
        workYears.forEach((workYear) => {
          ScrollTrigger.create({
            trigger: workYear,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              gsap.to(workYear, {
                y: self.progress * -100,
                duration: 0.3,
                ease: "none",
              });
            },
          });
        });
      }
    },
    { scope: workRef, dependencies: [isClient] }
  );

  return (
    <>
      <div className="work" ref={workRef} suppressHydrationWarning>
        <div className="work__year-indices">
          {portfolio.map((yearData, yearIndex) => (
            <div
              key={yearIndex}
              className={`work__year-index year-index year-index-var-${
                (yearIndex % 3) + 1
              }`}
              onClick={() => scrollToYear(yearIndex)}
              style={{ cursor: "pointer" }}
            >
              <Copy delay={0.85}>
                <p className="sm">{yearData.year.slice(-2)}</p>
              </Copy>
              <div className="work__year-index-highlighter year-index-highlighter"></div>
            </div>
          ))}
        </div>
        <div className="work__sidebar work-sidebar"></div>
        <div className="work__main work-main">
          {portfolio.map((yearData, yearIndex) => (
            <div key={yearIndex} className="work__container work-container">
              <div className="work-year-container">
                <Copy delay={0.85} animateOnScroll={false}>
                  <h1 className="work__year work-year">
                    '{yearData.year.slice(-2)}
                  </h1>
                </Copy>
              </div>
              <div className="work__projects work-projects-container">
                {yearData.projects.map((project, projectIndex) => (
                  <div
                    key={projectIndex}
                    className="work__project work-project"
                    onClick={() => navigateToProject(project.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="work__project-img work-project-img">
                      <img src={prefixPath(project.img)} alt={project.name} />
                    </div>
                    <div className="work__project-info work-project-info">
                      <p className="sm work__project-info-name work-project-info-name">
                        {project.name}
                      </p>
                      <p className="sm work__project-info-tags work-project-info-tags">
                        {project.tags}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
