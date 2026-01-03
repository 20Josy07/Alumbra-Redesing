"use client";

import { useState, useEffect, useRef } from 'react';

export function useActiveSection(sectionIds: string[], options?: IntersectionObserverInit) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, {
      rootMargin: '-30% 0px -70% 0px', // Trigger when section is in the middle 40% of the viewport
      threshold: 0,
      ...options
    });

    const currentObserver = observer.current;

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        currentObserver.observe(element);
      }
    });

    return () => {
      currentObserver.disconnect();
    };
  }, [sectionIds, options]);

  return activeSection;
}
