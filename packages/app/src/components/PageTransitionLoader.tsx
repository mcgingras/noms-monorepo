"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PageTransitionLoader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      setShouldRender(true);
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); // Ensure loader shows for at least 1 second
    } else {
      timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Allow time for exit animation
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
  }, [pathname, searchParams]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative w-full h-full">
        <div
          className={`absolute inset-0 bg-blue-500 transition-transform duration-500 ${
            isLoading ? "animate-slide-in" : "animate-slide-out"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default PageTransitionLoader;
