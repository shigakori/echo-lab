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
      // Split into words first
      const text = element.textContent || "";
      const words = text.split(/(\s+)/); // keep spaces as tokens
      const wordSpans = [];
      const wordFrag = document.createDocumentFragment();
      for (const token of words) {
        const span = document.createElement("span");
        span.textContent = token;
        span.style.display = "inline-block";
        wordSpans.push(span);
        wordFrag.appendChild(span);
      }
      element.textContent = "";
      element.appendChild(wordFrag);

      // Group by line using top offsets
      const lines = [];
      let currentTop = null;
      let currentLine = [];
      for (const w of wordSpans) {
        const top = w.offsetTop;
        if (currentTop === null) {
          currentTop = top;
        }
        const isNewLine = Math.abs(top - currentTop) > 1; // new visual row
        if (isNewLine) {
          lines.push(currentLine);
          currentLine = [];
          currentTop = top;
        }
        currentLine.push(w);
      }
      if (currentLine.length) lines.push(currentLine);

      // Wrap each line with mask container
      result.lines = [];
      const containerFrag = document.createDocumentFragment();
      for (const lineWords of lines) {
        const mask = document.createElement("span");
        mask.className = options.linesClass || "copy__line";
        mask.style.display = "block";
        mask.style.overflow = "hidden";

        const lineInner = document.createElement("span");
        lineInner.style.display = "inline-block";
        lineInner.style.transform = "translateY(100%)";
        mask.appendChild(lineInner);

        for (const w of lineWords) {
          lineInner.appendChild(w);
        }

        containerFrag.appendChild(mask);
        result.lines.push(lineInner);
      }

      element.innerHTML = "";
      element.appendChild(containerFrag);
    }

    return result;
  },
};
