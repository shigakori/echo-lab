export const SplitText = {
  create(element, options = {}) {
    const lines = [element];
    return {
      lines,
      revert() {},
    };
  },
};
