export const SplitText = {
  create(element, options = {}) {
    if (!element || typeof window === "undefined") {
      return { lines: [], chars: [], revert() {} };
    }

    const originalHTML = element.innerHTML;
    const result = {
      lines: [],
      chars: [],
      revert() {
        element.innerHTML = originalHTML;
      },
    };

    const type = options.type || "";
    if (typeof type === "string" && type.includes("chars")) {
      const text = element.textContent || "";
      const frag = document.createDocumentFragment();
      result.chars = [];
      for (const ch of text) {
        const span = document.createElement("span");
        span.textContent = ch;
        result.chars.push(span);
        frag.appendChild(span);
      }
      element.textContent = "";
      element.appendChild(frag);
    }

    if (typeof type === "string" && type.includes("lines")) {
      // Simplified: single-line mask that preserves original wrapping
      const mask = document.createElement("span");
      mask.className = options.linesClass || "copy__line";
      mask.style.display = "block";
      mask.style.overflow = "hidden";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.transform = "translateY(100%)";
      inner.innerHTML = originalHTML;
      mask.appendChild(inner);

      element.innerHTML = "";
      element.appendChild(mask);

      result.lines = [inner];
    }

    return result;
  },
};
