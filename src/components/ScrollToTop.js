import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, state } = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef({});

  useEffect(() => {
    // Store current scroll position before navigating away
    return () => {
      scrollPositions.current[pathname] = window.scrollY;
    };
  }, [pathname]);

  useEffect(() => {
    // If user clicked back/forward button, restore scroll position
    if (navigationType === 'POP') {
      const savedPosition = scrollPositions.current[pathname];
      if (savedPosition !== undefined) {
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 0);
      }
    } 
    // If preserveScroll state is passed, don't scroll
    else if (state?.preserveScroll) {
      // Keep current position
      return;
    }
    // Otherwise scroll to top (normal navigation)
    else {
      window.scrollTo(0, 0);
    }
  }, [pathname, state, navigationType]);

  return null;
}
