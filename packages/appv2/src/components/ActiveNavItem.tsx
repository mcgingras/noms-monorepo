"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveNavItem = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <>
      <Link href={href}>
        <span
          className={`flex flex-row items-center text-sm px-2 py-1.5 ${
            isActive
              ? "bg-gray-1000 rounded-lg text-gray-200"
              : "text-[#8E8E8E]"
          }`}
        >
          {children}
        </span>
      </Link>
    </>
  );
};

export default ActiveNavItem;
