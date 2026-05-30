'use client';

import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  /** Dirección del desplazamiento de entrada */
  direction?: Direction;
  /** Retraso en ms (para escalonar manualmente) */
  delay?: number;
  /** Distancia del desplazamiento en px */
  distance?: number;
  /** Aplicar blur-to-sharp (estilo Apple) */
  blur?: boolean;
  /** Etiqueta HTML a renderizar */
  as?: ElementType;
  className?: string;
  /** Umbral del IntersectionObserver */
  threshold?: number;
  /** Solo animar una vez (default true) */
  once?: boolean;
  style?: React.CSSProperties;
}

/**
 * Reveal — animación de entrada al hacer scroll, con easing tipo Apple.
 * Respeta `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  distance = 28,
  blur = true,
  as: Tag = 'div',
  className,
  threshold = 0.15,
  once = true,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta accesibilidad
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const offset: Record<Direction, string> = {
    up: `translate3d(0, ${distance}px, 0)`,
    down: `translate3d(0, -${distance}px, 0)`,
    left: `translate3d(${distance}px, 0, 0)`,
    right: `translate3d(-${distance}px, 0, 0)`,
    none: 'translate3d(0, 0, 0)',
  };

  return (
    <Tag
      ref={ref as never}
      className={cn('will-change-[opacity,transform,filter]', className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translate3d(0,0,0)' : offset[direction],
        filter: blur ? (shown ? 'blur(0px)' : 'blur(10px)') : undefined,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
