// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// jsdom ships no IntersectionObserver, and react-vertical-timeline-component
// observes scroll visibility on mount. Stub it so rendering App doesn't throw.
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
