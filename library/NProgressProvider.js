"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function NProgressHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, [pathname]);

  return null;
}
