"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// r stands for rotate
const Nom = ({
  x,
  y,
  r,
  c,
}: {
  x: number;
  y: number;
  r: number;
  c: number;
}) => {
  let colorString =
    c === 0
      ? "bg-blue-600 text-blue-300"
      : c === 1
      ? "bg-red-600 text-red-300"
      : "bg-green-600 text-green-300";
  return (
    <div
      className="absolute"
      style={{ top: y, left: x, transform: `rotate(${r}deg)` }}
    >
      <div
        className={`${colorString} rounded-lg oziksoft text-[200px] leading-[100px] font-bold h-[200px] flex items-center justify-center px-10`}
      >
        noms
      </div>
    </div>
  );
};

const generateNom = (i: number) => {
  return {
    index: i,
    x: Math.random() * window.innerWidth * 2 - window.innerWidth,
    y: Math.random() * window.innerHeight * 2 - window.innerHeight,
    r: Math.random() * 60 - 31,
    c: Math.floor(Math.random() * 1),
  };
};

const totalNoms = 250;
const animationDuration = 1000; // Total animation duration in milliseconds
const fps = 60; // Frames per second for smooth animation

const easeInOut = (t: number) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// COMPONENT
const TransitionPageDemo = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFadeIn, setIsFadeIn] = useState<boolean>(true);
  const [stop, setStop] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  const noms = useMemo(
    () => Array.from({ length: totalNoms }, (_, i) => generateNom(i)),
    []
  );

  //   useEffect(() => {
  //     let timer;
  //     if (isLoading) {
  //       setShouldRender(true);
  //       timer = setTimeout(() => {
  //         setIsLoading(false);
  //       }, 1000); // Ensure loader shows for at least 1 second
  //     } else {
  //       timer = setTimeout(() => {
  //         setShouldRender(false);
  //       }, 500); // Allow time for exit animation
  //     }
  //     return () => clearTimeout(timer);
  //   }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
  }, [pathname, searchParams]);

  const updateNoms = useCallback(
    (progress: number) => {
      const easedProgress = easeInOut(progress);
      const nomsToShow = Math.floor(easedProgress * totalNoms);
      setStop(nomsToShow);
    },
    [totalNoms]
  );

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      updateNoms(progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }

      if (progress === 1) {
        setIsFadeIn(false);
        animationFrameId = requestAnimationFrame(animateOut);
      }
    };

    const animateOut = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;

      const progress = Math.min(
        (elapsedTime - animationDuration) / animationDuration,
        1
      );

      updateNoms(1 - progress);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateOut);
      }

      if (progress === 1) {
        setIsLoading(false);
        setShouldRender(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoading, updateNoms, animationDuration]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 h-full w-full">
      <div className="relative w-full h-full">
        <div
          className={`absolute inset-0 bg-blue-500 transition-transform duration-500 ${
            isFadeIn ? "animate-slide-in" : "animate-slide-out"
          }`}
        />
        {noms.slice(0, stop).map((nom) => (
          <Nom key={nom.index} x={nom.x} y={nom.y} r={nom.r} c={nom.c} />
        ))}
      </div>
    </div>
  );
};

export default TransitionPageDemo;
