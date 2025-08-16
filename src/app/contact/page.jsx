"use client";
import "./contact.css";
import { useRef, useState, useEffect } from "react";

import Copy from "@/components/Copy/Copy";
import { prefixPath } from "@/lib/asset";

import { useTransitionRouter } from "next-view-transitions";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const page = () => {
  const router = useTransitionRouter();
  const contactRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useGSAP(
    () => {
      if (!isClient || !contactRef.current) return;

      const contactImg = contactRef.current.querySelector(
        ".contact__img, .contact-img"
      );
      const footerTexts = contactRef.current.querySelectorAll(
        ".contact__footer .contact__footer-text, .contact-footer .footer-text"
      );

      gsap.set(contactImg, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      });

      gsap.to(contactImg, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1,
        delay: 0.85,
        ease: "power3.out",
      });

      footerTexts.forEach((element) => {
        const textContent = element.querySelector(
          ".contact__footer-text-content, .footer-text-content"
        );
        gsap.set(textContent, {
          y: "100%",
        });
      });

      footerTexts.forEach((element, index) => {
        const textContent = element.querySelector(
          ".contact__footer-text-content, .footer-text-content"
        );
        gsap.to(textContent, {
          y: "0%",
          duration: 0.8,
          delay: 1.8 + index * 0.1,
          ease: "power3.out",
        });
      });
    },
    { scope: contactRef, dependencies: [isClient] }
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

  const handleNavigation = (e, route) => {
    e.preventDefault();
    router.push(route, {
      onTransitionReady: slideInOut,
    });
  };

  return (
    <div className="contact" ref={contactRef}>
      <div className="contact__img-wrapper contact-img-wrapper">
        <div className="contact__img contact-img">
          <img src={prefixPath("/images/contact/contact.jpeg")} alt="" />
        </div>
      </div>
      <div className="contact__copy contact-copy">
        <div className="contact__copy-bio contact-copy-bio">
          <Copy delay={1}>
            <p className="caps sm">Echo Lab Studios</p>
            <p className="caps sm">Stockholm</p>
          </Copy>
        </div>

        <div className="contact__copy-tags contact-copy-tags">
          <Copy delay={1.15}>
            <p className="caps sm">Web Systems</p>
            <p className="caps sm">Interface Design</p>
            <p className="caps sm">Creative Development</p>
            <p className="caps sm">End To End Delivery</p>
          </Copy>
        </div>

        <div className="contact__copy-addresses contact-copy-addresses">
          <div className="contact__address contact-address">
            <Copy delay={1.3}>
              <p className="caps sm">Stockholm</p>
              <p className="caps sm">Studio 15, Drottninggatan 42</p>
              <p className="caps sm">111 51 STOCKHOLM</p>
            </Copy>
          </div>

          <div className="contact__address contact-address">
            <Copy delay={1.45}>
              <p className="caps sm">Stockholm</p>
              <p className="caps sm">Unit 8, Birger Jarlsgatan 23</p>
              <p className="caps sm">114 34 STOCKHOLM</p>
            </Copy>
          </div>
        </div>

        <div className="contact__copy-links contact-copy-links">
          <Copy delay={1.6}>
            <a href="/studio" onClick={(e) => handleNavigation(e, "/studio")}>
              <p className="caps sm">Studio Overview</p>
            </a>
            <a href="/archive" onClick={(e) => handleNavigation(e, "/archive")}>
              <p className="caps sm">Project Archive</p>
            </a>
            <a href="/work" onClick={(e) => handleNavigation(e, "/work")}>
              <p className="caps sm">Selected Work</p>
            </a>
          </Copy>
        </div>
      </div>

      <div className="contact__footer contact-footer">
        <div className="contact__footer-col--lg fc-col-lg">
          <div className="contact__footer-text footer-text">
            <div className="contact__footer-text-content footer-text-content">
              <p className="sm caps">Developed by Shigakori</p>
            </div>
          </div>
        </div>
        <div className="contact__footer-col--sm fc-col-sm">
          <div className="contact__footer-text footer-text">
            <div className="contact__footer-text-content footer-text-content">
              <p className="sm caps">&copy; 2025 All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
