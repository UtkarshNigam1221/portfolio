// jsdom ships no IntersectionObserver, and react-vertical-timeline-component
// observes scroll visibility on mount. Stub it so rendering App doesn't throw.
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
