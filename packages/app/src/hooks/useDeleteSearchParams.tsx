"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export const useDeleteSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    ({ names, clean }: { names: string[]; clean?: boolean }) => {
      const params = new URLSearchParams(
        clean ? undefined : searchParams?.toString()
      );
      names.forEach((name) => {
        params.delete(name);
      });
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, pathname]
  );
};
