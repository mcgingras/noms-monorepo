"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export const useAddSearchParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const addParam = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return addParam;
};

// import { useSearchParams, usePathname } from "next/navigation";
// import { useCallback } from "react";

// export const useAddSearchParam = () => {
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   return useCallback(
//     ({
//       name,
//       value,
//       clean,
//     }: {
//       name: string;
//       value: string;
//       clean?: boolean;
//     }) => {
//       const params = new URLSearchParams(
//         clean ? undefined : searchParams?.toString()
//       );
//       params.set(name, value);
//       return pathname + "?" + params.toString();
//     },
//     [searchParams, pathname]
//   );
// };
