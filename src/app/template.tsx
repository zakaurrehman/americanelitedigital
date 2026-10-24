"use client";

import { useLayoutEffect, useRef } from "react";

// Next.js re-mounts a template on every navigation. The first page load is left alone (so
// nothing delays the first paint); later client-side navigations get a short entrance.
let isFirstMount = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (isFirstMount) {
      isFirstMount = false;
      return;
    }
    ref.current?.classList.add("page-enter");
  }, []);

  return <div ref={ref}>{children}</div>;
}
