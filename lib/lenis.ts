import Lenis from 'lenis';

export function createLenis() {
  return new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    lerp: 0.08,
    orientation: 'vertical',
    gestureOrientation: 'vertical'
  });
}
