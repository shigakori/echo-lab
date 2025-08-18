"use client";
import "./Menu.css";
import { useRef, useState, useEffect } from "react";

import { useTransitionRouter } from "next-view-transitions";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { IoMdArrowUp } from "react-icons/io";
import { prefixPath } from "@/lib/asset";

gsap.registerPlugin(CustomEase, ScrollTrigger, ScrollToPlugin);
CustomEase.create("hop", ".15, 1, .25, 1");

const Menu = ({ onMenuStateChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [currentTime, setCurrentTime] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useTransitionRouter();

  const menuLinks = [
    { path: "/", label: "echo," },
    { path: "/work", label: "work," },
    { path: "/studio", label: "studio," },
    { path: "/archive", label: "archive," },
    { path: "/contact", label: "contact," },
  ];

  const socialLinks = [
    { url: "https://www.youtube.com/@shigakori", label: "YouTube" },
    { url: "https://www.instagram.com/shigakori/", label: "Instagram" },
    { url: "https://x.com/shigakori", label: "X" },
  ];

  const menuRef = useRef(null);
  const menuOverlayRef = useRef(null);

  const navLogoRef = useRef(null);
  const menuToggleRef = useRef(null);

  const closeBtnRef = useRef(null);

  const menuItemsRef = useRef(null);
  const menuFooterColsRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateTime = () => {
      const now = new Date();
      const timeString = now
        .toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/:/g, ":")
        .toUpperCase();
      setCurrentTime(timeString);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleRouteChange = () => {
      if (typeof window !== "undefined") {
        setCurrentPath(window.location.pathname);
        if (
          menuOverlayRef.current &&
          menuOverlayRef.current.style.opacity !== "0"
        ) {
          closeMenu();
        }
      }
    };

    const handleClickOutside = (event) => {
      if (
        menuOverlayRef.current &&
        !menuOverlayRef.current.contains(event.target) &&
        !menuToggleRef.current?.contains(event.target) &&
        !closeBtnRef.current?.contains(event.target) &&
        menuOverlayRef.current.style.opacity !== "0"
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        menuOverlayRef.current &&
        menuOverlayRef.current.style.opacity !== "0"
      ) {
        closeMenu();
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    router.events?.on?.("routeChangeComplete", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      router.events?.off?.("routeChangeComplete", handleRouteChange);
    };
  }, [router, isClient]);

  useGSAP(
    () => {
      if (
        !isClient ||
        !menuOverlayRef.current ||
        !menuToggleRef.current ||
        !closeBtnRef.current
      )
        return;

      gsap.set(menuOverlayRef.current, {
        opacity: 0,
        transform: "translateX(100%)",
        pointerEvents: "none",
      });

      gsap.set(menuToggleRef.current, {
        opacity: 1,
        pointerEvents: "all",
      });

      gsap.set(closeBtnRef.current, {
        opacity: 0,
        pointerEvents: "none",
      });

      gsap.set(".menu__items .revealer a, .menu-overlay-items .revealer a", {
        y: "100%",
      });

      gsap.set(
        ".menu__footer .revealer p, .menu__footer .revealer a, .menu-footer .revealer p, .menu-footer .revealer a",
        {
          y: "100%",
        }
      );
    },
    { scope: menuRef, dependencies: [isClient] }
  );

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

  const isExactPath = (path) => {
    return (
      (typeof window !== "undefined"
        ? window.location.pathname
        : currentPath) === path
    );
  };

  const navigateTo = (path) => {
    closeMenu();

    if (!isExactPath(path)) {
      setTimeout(() => {
        router.push(path, { onTransitionReady: slideInOut });
      }, 50);
    }
  };

  const handleMenuToggleHover = () => {
    if (!menuToggleRef.current) return;
    gsap.to(menuToggleRef.current, {
      background: "rgba(0, 0, 0, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMenuToggleLeave = () => {
    if (!menuToggleRef.current) return;
    gsap.to(menuToggleRef.current, {
      background: "rgba(0, 0, 0, 0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCloseToggleHover = () => {
    if (!closeBtnRef.current) return;
    gsap.to(closeBtnRef.current, {
      background: "rgba(0, 0, 0, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCloseToggleLeave = () => {
    if (!closeBtnRef.current) return;
    gsap.to(closeBtnRef.current, {
      background: "rgba(0, 0, 0, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLinkHover = (event) => {
    const allLinks = document.querySelectorAll(
      ".menu__items .revealer, .menu-overlay-items .revealer"
    );
    const hoveredLink = event.currentTarget.closest(".revealer");

    allLinks.forEach((link) => {
      if (link !== hoveredLink) {
        gsap.to(link, {
          opacity: 0.4,
          duration: 0.2,
          ease: "power2.out",
        });
      } else {
        gsap.to(link, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    });
  };

  const handleLinkLeave = () => {
    const allLinks = document.querySelectorAll(
      ".menu__items .revealer, .menu-overlay-items .revealer"
    );

    allLinks.forEach((link) => {
      gsap.to(link, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  };

  const handleSocialHover = (event) => {
    const allSocials = document.querySelectorAll(
      ".menu__socials .revealer, .socials .revealer"
    );
    const hoveredSocial = event.currentTarget.closest(".revealer");

    allSocials.forEach((social) => {
      if (social !== hoveredSocial) {
        gsap.to(social, {
          opacity: 0.4,
          duration: 0.2,
          ease: "power2.out",
        });
      } else {
        gsap.to(social, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    });
  };

  const handleSocialLeave = () => {
    const allSocials = document.querySelectorAll(
      ".menu__socials .revealer, .socials .revealer"
    );

    allSocials.forEach((social) => {
      gsap.to(social, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    });
  };

  const scrollToTop = () => {
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 2,
      ease: "power2.inOut",
    });
  };

  const handleScrollTopHover = () => {
    if (!isClient) return;
    gsap.to(".menu__scroll-top-toggle, .scroll-top-toggle", {
      background: "rgba(0, 0, 0, 0.5)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleScrollTopLeave = () => {
    if (!isClient) return;
    gsap.to(".menu__scroll-top-toggle, .scroll-top-toggle", {
      background: "rgba(0, 0, 0, 0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  useGSAP(
    () => {
      if (!isClient) return;

      const scrollTopToggle = document.querySelector(
        ".menu__scroll-top-toggle, .scroll-top-toggle"
      );
      if (!scrollTopToggle) return;

      gsap.set(scrollTopToggle, {
        opacity: 0,
        visibility: "hidden",
        scale: 0.8,
      });

      ScrollTrigger.create({
        trigger: "body",
        start: "top -300px",
        onEnter: () => {
          gsap.to(scrollTopToggle, {
            opacity: 1,
            visibility: "visible",
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(scrollTopToggle, {
            opacity: 0,
            visibility: "hidden",
            scale: 0.8,
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
    },
    { dependencies: [isClient] }
  );

  const openMenu = () => {
    if (
      isAnimating ||
      !menuOverlayRef.current ||
      !menuToggleRef.current ||
      !closeBtnRef.current
    )
      return;

    onMenuStateChange?.(true);

    setIsAnimating(true);
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false),
    });

    closeBtnRef.current.style.opacity = "0";
    closeBtnRef.current.style.pointerEvents = "none";

    tl.to(
      menuOverlayRef.current,
      {
        opacity: 1,
        transform: "translateX(0%)",
        duration: 0.8,
        ease: "power2.inOut",
        onStart: () => {
          menuOverlayRef.current.style.pointerEvents = "all";
        },
      },
      "-=0.45"
    );

    tl.to(
      menuToggleRef.current,
      {
        opacity: 0,
        scale: 0.8,
        transform: "translateY(-50%) scale(0.8)",
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          menuToggleRef.current.style.pointerEvents = "none";
        },
      },
      "<"
    );

    tl.to(
      ".menu__items .revealer a, .menu-overlay-items .revealer a",
      {
        y: "0%",
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.inOut",
      },
      "+=0.2"
    );

    tl.to(
      ".menu__footer .revealer p, .menu__footer .revealer a, .menu-footer .revealer p, .menu-footer .revealer a",
      {
        y: "0%",
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.inOut",
      },
      "+=0.1"
    );

    tl.to(
      closeBtnRef.current,
      {
        opacity: 1,
        scale: 1,
        transform: "translateY(-50%) scale(1)",
        duration: 0.5,
        ease: "power2.out",
        onStart: () => {
          closeBtnRef.current.style.pointerEvents = "all";
        },
      },
      "+=0.2"
    );
  };

  const closeMenu = () => {
    console.log("closeMenu called, isAnimating:", isAnimating);

    if (
      !menuOverlayRef.current ||
      !menuToggleRef.current ||
      !closeBtnRef.current
    ) {
      console.log("Menu refs not ready, cannot close");
      return;
    }

    if (isAnimating) {
      console.log(
        "Menu is animating, killing all animations and forcing close"
      );
      gsap.killTweensOf([
        menuOverlayRef.current,
        menuToggleRef.current,
        closeBtnRef.current,
      ]);
      gsap.killTweensOf(
        ".menu__items .revealer a, .menu-overlay-items .revealer a"
      );
      gsap.killTweensOf(
        ".menu__footer .revealer p, .menu__footer .revealer a, .menu-footer .revealer p, .menu-footer .revealer a"
      );
    }

    console.log("Starting close animation");
    onMenuStateChange?.(false);

    setIsAnimating(true);
    const tl = gsap.timeline({
      onComplete: () => {
        console.log("Close animation completed");
        setIsAnimating(false);
      },
    });

    tl.to(
      closeBtnRef.current,
      {
        opacity: 0,
        scale: 0.8,
        transform: "translateY(-50%) scale(0.8)",
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          closeBtnRef.current.style.pointerEvents = "none";
        },
      },
      "<"
    );

    tl.to(
      ".menu__items .revealer a, .menu-overlay-items .revealer a",
      {
        y: "-100%",
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.inOut",
      },
      "<"
    );

    tl.to(
      ".menu__footer .revealer p, .menu__footer .revealer a, .menu-footer .revealer p, .menu-footer .revealer a",
      {
        y: "-100%",
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.inOut",
      },
      "<"
    );

    tl.to(
      menuOverlayRef.current,
      {
        opacity: 0,
        transform: "translateX(100%)",
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          menuOverlayRef.current.style.pointerEvents = "none";
          console.log("Menu overlay hidden");
        },
      },
      "+=0.1"
    );

    tl.to(
      menuToggleRef.current,
      {
        opacity: 1,
        scale: 1,
        transform: "translateY(-50%) scale(1)",
        duration: 0.5,
        ease: "power2.out",
        onStart: () => {
          menuToggleRef.current.style.pointerEvents = "all";
        },
      },
      "-=0.45"
    );
  };

  const timeDisplay = isClient ? currentTime : "";

  return (
    <>
      <div className="menu__nav" suppressHydrationWarning>
        <div className="menu__nav-inner">
          <div className="menu__logo">
            <div className="revealer">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isExactPath("/")) {
                    router.push("/", { onTransitionReady: slideInOut });
                  }
                }}
              >
                <img
                  src={prefixPath("/images/logos/logo_light.png")}
                  alt="ECHO"
                  className="logo-image"
                  style={{
                    height: "2rem",
                    width: "auto",
                    filter: "brightness(0) invert(1)",
                    opacity: 1,
                    visibility: "visible",
                  }}
                />
              </a>
            </div>
          </div>
          <div className="menu__nav-items">
            <div className="menu__time">
              <div className="revealer">
                <p className="sm caps mono" suppressHydrationWarning>
                  {timeDisplay}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="menu" ref={menuRef}>
        <div
          className="menu__toggle"
          onClick={openMenu}
          ref={menuToggleRef}
          onMouseEnter={handleMenuToggleHover}
          onMouseLeave={handleMenuToggleLeave}
        >
          <p className="sm caps mono">Menu</p>
        </div>
        <div
          className="menu__scroll-top-toggle"
          onClick={scrollToTop}
          onMouseEnter={handleScrollTopHover}
          onMouseLeave={handleScrollTopLeave}
        >
          <IoMdArrowUp />
        </div>
        <div className="menu__overlay" ref={menuOverlayRef}>
          <div className="menu__items" ref={menuItemsRef}>
            {menuLinks.map((link, index) => (
              <div key={link.path} className="revealer">
                <a
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(link.path);
                  }}
                  onMouseEnter={handleLinkHover}
                  onMouseLeave={handleLinkLeave}
                >
                  <h1>{link.label}</h1>
                </a>
              </div>
            ))}
          </div>
          <div className="menu__footer" ref={menuFooterColsRef}>
            <div className="menu-footer-col">
              <div className="revealer">
                <p className="sm caps mono">&copy; 2025 All Rights Reserved</p>
              </div>
            </div>
            <div className="menu-footer-col">
              <div className="menu__socials">
                {socialLinks.map((social, index) => (
                  <div key={social.url} className="revealer">
                    <a
                      className="sm caps mono"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={handleSocialHover}
                      onMouseLeave={handleSocialLeave}
                    >
                      {social.label}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          className="menu__toggle--close"
          onClick={() => {
            console.log("Close button clicked");
            closeMenu();
          }}
          ref={closeBtnRef}
          onMouseEnter={handleCloseToggleHover}
          onMouseLeave={handleCloseToggleLeave}
        >
          <p>Close</p>
        </div>
      </div>
    </>
  );
};

export default Menu;
