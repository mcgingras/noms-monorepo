"use client";

import useWindowSize from "../hooks/useWindowSize";

const MobilePlaceholder = ({ children }: { children: React.ReactNode }) => {
  const { width } = useWindowSize();

  if (!width) return null;

  if (width && width > 1024) {
    return children;
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-blue-500">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row"></div>
        <div className="bg-blue-600 text-blue-300 rounded-lg oziksoft text-[120px] font-bold h-[120px] flex items-center justify-center px-5 pb-4">
          noms
        </div>
        <div className="inline-block rounded-full px-4 py-2 mt-6 bg-blue-100 text-blue-500 pangram-sans font-bold">
          Now available on desktop
        </div>
      </div>
    </div>
  );
};

export default MobilePlaceholder;
