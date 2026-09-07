import type { ReactNode } from "react";
import { octbSourceUrl } from "@/lib/gadaa-data";

export function Page({
  eyebrow,
  title,
  intro,
  source,
  hero,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  source?: string;
  hero?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className={`animate-rise w-full ${hero ? "" : "mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12"}`}>
      {hero ?? (
        <>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{intro}</p>
          {source && (
            <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
              {source}{" "}
              <a
                href={octbSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-gold underline-offset-2 hover:underline"
              >
                oromiatourism.gov.et
              </a>
            </p>
          )}
        </>
      )}
      <div className={hero ? "mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10" : "mt-8 space-y-8"}>
        {children}
      </div>
    </main>
  );
}
