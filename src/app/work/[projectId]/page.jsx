"use client";
import { useParams } from "next/navigation";
import { portfolio } from "../portfolio";
import { useRef, useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useGSAP } from "@gsap/react";
import Copy from "@/components/Copy/Copy";
import BtnLink from "@/components/BtnLink/BtnLink";
import { prefixPath } from "@/lib/asset";
import "./project-page.css";

gsap.registerPlugin(ScrollTrigger);

const ProjectPage = () => {
  const params = useParams();
  const projectRef = useRef(null);
  const router = useTransitionRouter();

  const findProject = () => {
    for (const yearData of portfolio) {
      const project = yearData.projects.find((p) => p.id === params.projectId);
      if (project) {
        return { project, year: yearData.year };
      }
    }
    return null;
  };

  const projectData = findProject();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 200);

    return () => clearTimeout(timer);
  }, [params.projectId]);

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

  const navigateBack = () => {
    router.push("/work", { onTransitionReady: slideInOut });
  };

  const findAdjacentProjects = () => {
    let currentProjectIndex = -1;
    let currentYearIndex = -1;

    for (let yearIndex = 0; yearIndex < portfolio.length; yearIndex++) {
      const yearData = portfolio[yearIndex];
      const projectIndex = yearData.projects.findIndex(
        (p) => p.id === params.projectId
      );
      if (projectIndex !== -1) {
        currentProjectIndex = projectIndex;
        currentYearIndex = yearIndex;
        break;
      }
    }

    if (currentProjectIndex === -1) return { prev: null, next: null };

    const allProjects = [];
    portfolio.forEach((yearData, yearIndex) => {
      yearData.projects.forEach((project, projectIndex) => {
        allProjects.push({
          ...project,
          year: yearData.year,
          yearIndex,
          projectIndex,
        });
      });
    });

    const currentIndex = allProjects.findIndex(
      (p) => p.id === params.projectId
    );

    const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
    const nextProject =
      currentIndex < allProjects.length - 1
        ? allProjects[currentIndex + 1]
        : null;

    return { prev: prevProject, next: nextProject };
  };

  const navigateToProject = (projectId) => {
    router.push(`/work/${projectId}`, { onTransitionReady: slideInOut });
  };

  useGSAP(
    () => {
      if (!projectData) return;

      const imagesContainer = projectRef.current.querySelector(
        ".project__images-container"
      );
      const progressContainer = projectRef.current.querySelector(
        ".project__images-scroll-progress-container"
      );
      const counter = projectRef.current.querySelector(
        "#project__images-scroll-counter"
      );
      const bannerImg = projectRef.current.querySelector(
        ".project__banner-img"
      );
      const btnLinkWrapper = projectRef.current.querySelector(
        ".project__link-wrapper"
      );

      gsap.set(bannerImg, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      gsap.to(bannerImg, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1,
        delay: 1,
        ease: "power4.out",
      });

      if (btnLinkWrapper) {
        gsap.set(btnLinkWrapper, { y: 30, opacity: 0 });

        ScrollTrigger.create({
          trigger: btnLinkWrapper.closest(".project__copy-description"),
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(btnLinkWrapper, {
              y: 0,
              opacity: 1,
              duration: 1,
              delay: 1,
              ease: "power4.out",
            });
          },
        });
      }

      ScrollTrigger.create({
        trigger: imagesContainer,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.progress > 0 && self.progress < 1) {
            progressContainer.style.opacity = "1";
          } else {
            progressContainer.style.opacity = "0";
          }
          const progress = Math.round(self.progress * 100);
          counter.textContent = progress;

          const isMobile = window.innerWidth < 1000;
          const isSmallMobile = window.innerWidth < 500;

          let baseDistance, mobileMultiplier;

          if (isSmallMobile) {
            baseDistance = window.innerHeight * 1.5;
            mobileMultiplier = 1.5;
          } else if (isMobile) {
            baseDistance = window.innerHeight * 1.3;
            mobileMultiplier = 1.3;
          } else {
            baseDistance = window.innerHeight * 1.2;
            mobileMultiplier = 1.2;
          }

          const moveDistance = baseDistance * mobileMultiplier;

          gsap.to(progressContainer, {
            y: -self.progress * moveDistance,
            duration: 0.2,
            ease: "power2.out",
          });

          const fastImages = imagesContainer.querySelectorAll(
            ".project__img--fast"
          );
          const mediumImages = imagesContainer.querySelectorAll(
            ".project__img--medium"
          );
          const slowImages = imagesContainer.querySelectorAll(
            ".project__img--slow"
          );

          fastImages.forEach((img, index) => {
            const speed = 300 + index * 20;
            const xOffset = (index % 2 === 0 ? 1 : -1) * (50 + index * 5);
            gsap.to(img, {
              y: -self.progress * speed,
              x: self.progress * xOffset,
              duration: 0.05,
              ease: "power2.out",
            });
          });

          mediumImages.forEach((img, index) => {
            const speed = 200 + index * 15;
            const xOffset = (index % 2 === 0 ? -1 : 1) * (30 + index * 3);
            gsap.to(img, {
              y: -self.progress * speed,
              x: self.progress * xOffset,
              duration: 0.05,
              ease: "power2.out",
            });
          });

          slowImages.forEach((img, index) => {
            const speed = 100 + index * 10;
            const xOffset = (index % 2 === 0 ? 1 : -1) * (20 + index * 2);
            gsap.to(img, {
              y: -self.progress * speed,
              x: self.progress * xOffset,
              duration: 0.05,
              ease: "power2.out",
            });
          });
        },
      });

      gsap.set(progressContainer, {
        position: "fixed",
        top: "100vh",
        left: "1.5rem",
        right: "1.5rem",
        width: "calc(100% - 3rem)",
        opacity: 0,
      });
    },
    { scope: projectRef }
  );

  if (!projectData) {
    return (
      <div className="project-not-found">
        <h1>Project not found</h1>
        <button onClick={navigateBack}>Back to works</button>
      </div>
    );
  }

  const { project, year } = projectData;

  return (
    <div className="project" ref={projectRef}>
      <section className="project__hero">
        <Copy delay={0.85}>
          <h1>{project.name}</h1>
        </Copy>
      </section>

      <section className="project__banner-img">
        <img src={prefixPath(project.img)} alt={project.name} />
      </section>

      <section className="project__copy">
        <div className="project__info">
          <div className="project__col project__col--lg">
            <div className="project__tags">
              <Copy>
                {project.tags.split(", ").map((tag, index) => (
                  <p key={index} className="sm caps mono">
                    {tag}
                  </p>
                ))}
              </Copy>
            </div>
          </div>
          <div className="project__col project__col--sm">
            <div className="project__year">
              <Copy delay={0.15}>
                <p className="sm caps mono">{year}</p>
              </Copy>
            </div>

            <div className="project__client">
              <Copy delay={0.3}>
                <p className="sm caps mono">Self-Initiated</p>
              </Copy>
            </div>
          </div>
        </div>

        <div className="project__copy-wrapper">
          <div className="project__col--lg">
            <div className="project__copy-title">
              <Copy>
                <h3>_project desc</h3>
              </Copy>
            </div>
          </div>
          <div className="project__col--sm">
            <div className="project__copy-description">
              <Copy>
                <p>
                  {project.description ||
                    "The project description will be added later. This project demonstrates a creative approach to design and modern technologies."}
                </p>
                <br />
                <p>
                  The project was created using advanced technologies and
                  innovative solutions aimed at creating a unique user
                  experience.
                </p>
              </Copy>

              <div className="project__link">
                <div className="project__link-wrapper">
                  <BtnLink
                    route="/work"
                    label="back to works"
                    direction="back"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="project__images">
        <div className="project__images-scroll-progress-container">
          <h1 id="project__images-scroll-counter">0</h1>
          <h1>/100</h1>
        </div>
        <div className="project__images-container">
          <div className="project__img project__img--fast">
            <img src={prefixPath(project.img)} alt="" />
          </div>
          <div className="project__img project__img--slow">
            <img src={prefixPath("/images/work/work_021.jpeg")} alt="" />
          </div>
          <div className="project__img project__img--medium">
            <img src={prefixPath("/images/work/work_003.jpeg")} alt="" />
          </div>
          <div className="project__img project__img--fast">
            <img src={prefixPath("/images/work/work_009.jpeg")} alt="" />
          </div>
          <div className="project__img project__img--slow">
            <img src={prefixPath("/images/work/work_015.jpeg")} alt="" />
          </div>
          <div className="project__img project__img--medium">
            <img src={prefixPath("/images/work/work_023.jpeg")} alt="" />
          </div>
          <div className="project__img project__img--fast">
            <img src={prefixPath("/images/work/work_024.jpeg")} alt="" />
          </div>
          <div className="project__img project__img--slow">
            <img src={prefixPath("/images/work/work_001.jpeg")} alt="" />
          </div>
          <div className="project__img project__img--medium">
            <img src={prefixPath("/images/work/work_002.jpeg")} alt="" />
          </div>
        </div>
      </section>

      <section className="project__navigation">
        <div className="project__navigation-container">
          {findAdjacentProjects().prev && (
            <div className="project__nav-button project__nav-button--prev">
              <div className="project__nav-image project__nav-image--prev">
                <img
                  src={prefixPath(findAdjacentProjects().prev.img)}
                  alt={findAdjacentProjects().prev.name}
                />
              </div>
              <button
                className="project__nav-text"
                onClick={() =>
                  navigateToProject(findAdjacentProjects().prev.id)
                }
              >
                Prev Work
              </button>
            </div>
          )}

          {findAdjacentProjects().next && (
            <div className="project__nav-button project__nav-button--next">
              <button
                className="project__nav-text"
                onClick={() =>
                  navigateToProject(findAdjacentProjects().next.id)
                }
              >
                Next Work
              </button>
              <div className="project__nav-image project__nav-image--next">
                <img
                  src={prefixPath(findAdjacentProjects().next.img)}
                  alt={findAdjacentProjects().next.name}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="project__back-section">
        <div className="project__back-container">
          <BtnLink route="/work" label="back to works" direction="back" />
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
