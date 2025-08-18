"use client";
import "./Footer.css";
import { useRef, useState, useEffect } from "react";

import { useTransitionRouter } from "next-view-transitions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const router = useTransitionRouter();

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

  const handleNavLinkHover = (event) => {
    if (!isClient) return;

    const allNavLinks = document.querySelectorAll(
      ".footer__nav-item .footer__text"
    );
    const hoveredNavLink = event.currentTarget.closest(".footer__nav-item");

    allNavLinks.forEach((link) => {
      if (link.closest(".footer__nav-item") !== hoveredNavLink) {
        gsap.to(link, {
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(link, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  const handleNavLinkLeave = () => {
    if (!isClient) return;

    const allNavLinks = document.querySelectorAll(
      ".footer__nav-item .footer__text"
    );

    allNavLinks.forEach((link) => {
      gsap.to(link, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  };

  const handleSocialLinkHover = (event) => {
    if (!isClient) return;

    const allSocialLinks = document.querySelectorAll(
      ".footer__social .footer__text"
    );
    const hoveredSocialLink = event.currentTarget.closest(".footer__social");

    allSocialLinks.forEach((link) => {
      if (link.closest(".footer__social") !== hoveredSocialLink) {
        gsap.to(link, {
          opacity: 0.3,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(link, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  const handleSocialLinkLeave = () => {
    if (!isClient) return;

    const allSocialLinks = document.querySelectorAll(
      ".footer__social .footer__text"
    );

    allSocialLinks.forEach((link) => {
      gsap.to(link, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  };

  const handleNavigation = (e, route) => {
    e.preventDefault();
    router.push(route, {
      onTransitionReady: slideInOut,
    });
  };

  useGSAP(
    () => {
      if (!isClient || !footerRef.current) return;

      const textElements = footerRef.current.querySelectorAll(".footer-text");

      textElements.forEach((element) => {
        const textContent = element.querySelector(".footer-text-content");
        gsap.set(textContent, {
          y: "100%",
        });
      });

      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 80%",
        onEnter: () => {
          textElements.forEach((element, index) => {
            const textContent = element.querySelector(".footer-text-content");
            gsap.to(textContent, {
              y: "0%",
              duration: 0.8,
              delay: index * 0.1,
              ease: "power3.out",
            });
          });
        },
      });
    },
    { scope: footerRef, dependencies: [isClient] }
  );

  return (
    <div className="footer" ref={footerRef} suppressHydrationWarning>
      <div className="footer__links">
        <div className="footer__links-col-lg"></div>
        <div className="footer__links-col-sm">
          <div className="footer__links-section">
            <div className="footer__links-header">
              <div className="footer__text">
                <div className="footer__text-content">
                  <p className="sm caps">( Navigation )</p>
                </div>
              </div>
            </div>
            <div className="footer__nav">
              <div className="footer__nav-item">
                <a
                  href="/"
                  onClick={(e) => handleNavigation(e, "/")}
                  onMouseEnter={handleNavLinkHover}
                  onMouseLeave={handleNavLinkLeave}
                >
                  <div className="footer__text">
                    <div className="footer__text-content">
                      <p>Home</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="footer__nav-item">
                <a
                  href="/studio"
                  onClick={(e) => handleNavigation(e, "/studio")}
                  onMouseEnter={handleNavLinkHover}
                  onMouseLeave={handleNavLinkLeave}
                >
                  <div className="footer__text">
                    <div className="footer__text-content">
                      <p>Studio</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="footer__nav-item">
                <a
                  href="/work"
                  onClick={(e) => handleNavigation(e, "/work")}
                  onMouseEnter={handleNavLinkHover}
                  onMouseLeave={handleNavLinkLeave}
                >
                  <div className="footer__text">
                    <div className="footer__text-content">
                      <p>Work</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="footer__nav-item">
                <a
                  href="/archive"
                  onClick={(e) => handleNavigation(e, "/archive")}
                  onMouseEnter={handleNavLinkHover}
                  onMouseLeave={handleNavLinkLeave}
                >
                  <div className="footer__text">
                    <div className="footer__text-content">
                      <p>Archive</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="footer__nav-item">
                <a
                  href="/contact"
                  onClick={(e) => handleNavigation(e, "/contact")}
                  onMouseEnter={handleNavLinkHover}
                  onMouseLeave={handleNavLinkLeave}
                >
                  <div className="footer__text">
                    <div className="footer__text-content">
                      <p>Contact</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="footer__links-section">
            <div className="footer__links-header">
              <div className="footer__text">
                <div className="footer__text-content">
                  <p className="sm caps">( Socials )</p>
                </div>
              </div>
            </div>
            <div className="footer__social">
              <a
                href="mailto:shigakori@gmail.com"
                onMouseEnter={handleSocialLinkHover}
                onMouseLeave={handleSocialLinkLeave}
              >
                <div className="footer__text">
                  <div className="footer__text-content">
                    <p>Email</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="footer__social">
              <a
                href="https://www.linkedin.com/in/aziz-mukimov-585116368/"
                onMouseEnter={handleSocialLinkHover}
                onMouseLeave={handleSocialLinkLeave}
              >
                <div className="footer__text">
                  <div className="footer__text-content">
                    <p>LinkedIn</p>
                  </div>
                </div>
              </a>
            </div>
            <div className="footer__social">
              <a
                href="https://www.instagram.com"
                onMouseEnter={handleSocialLinkHover}
                onMouseLeave={handleSocialLinkLeave}
              >
                <div className="footer__text">
                  <div className="footer__text-content">
                    <p>Instagram</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__copy">
        <div className="footer__copy-col-lg">
          <div className="footer__text">
            <div className="footer__text-content">
              <p className="sm caps">
                Developed by{" "}
                <a
                  className="sm caps"
                  href="https://github.com/shigakori"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shigakori
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="footer__copy-col-sm">
          <div className="footer__text">
            <div className="footer__text-content">
              <p className="sm caps">&copy; 2025 All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
