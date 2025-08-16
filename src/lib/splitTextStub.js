export const SplitText = {
  create(element, options = {}) {
    if (!element || typeof window === "undefined") {
      return { lines: [], chars: [], revert() {} };
    }

    const originalHTML = element.innerHTML;
    const result = {
      lines: [element],
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

    return result;
  },
};
