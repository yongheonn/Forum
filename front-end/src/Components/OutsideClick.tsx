import { useEffect } from 'react';

const OutsideClick = (ref: React.RefObject<HTMLDivElement>, setState: () => void) => {
  // 1)
  useEffect(() => {
    const pageClickEvent = (e: globalThis.MouseEvent) => {
      if (ref.current !== null && !ref.current.contains(e.target as Node)) {
        setState();
      }
    };
    // 2)
    window.addEventListener('click', pageClickEvent);

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  });
  // 3)
  return [ref];
};

export default OutsideClick;
