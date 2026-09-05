import { useEffect, useState } from "react";
import { sitePhotos } from "@/lib/site-photos";
import type { MapSiteType } from "@/lib/oromia-map";

export function SiteScene({
  type,
  className = "h-full w-full",
  title,
}: {
  type: MapSiteType;
  className?: string;
  title?: string;
}) {
  const photo = sitePhotos[type];
  const [src, setSrc] = useState(photo.src);

  useEffect(() => {
    setSrc(photo.src);
  }, [photo.src]);

  const label = title ?? photo.place;

  return (
    <img
      src={src}
      alt={label}
      title={`${photo.place} — ${photo.credit}`}
      className={`block h-full w-full object-cover ${className}`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      onError={() => {
        if (src !== photo.fallback) setSrc(photo.fallback);
      }}
    />
  );
}
