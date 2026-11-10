import Image from "next/image";
import { firstImg } from "@/lib/media";
import { Illus, type IllusName } from "@/components/Illus";

const TINTS = {
  sea: "bg-sea text-chaux",
  turq: "bg-turq-soft text-sea",
  sand: "bg-sand-soft text-sea",
  chaux: "bg-chaux-deep text-sea",
  sky: "bg-sea-soft text-sea",
} as const;
export type Tint = keyof typeof TINTS;

/**
 * Emplacement photo (plat, comptoir, façade, équipe…). Tant que la photo n'existe pas dans public/media,
 * un dessin au trait sur fond de couleur la remplace : déposez la photo dans assets/<dossier>/ et lancez npm run media.
 */
export function Photo({
  paths,
  alt,
  illus,
  tint = "sand",
  sizes,
  className = "",
  imgClassName = "",
  priority = false,
  illusClassName = "h-1/2 w-1/2 max-h-40 max-w-40",
  strokeWidth = 2.6,
}: {
  paths: readonly string[];
  alt: string;
  illus: IllusName;
  tint?: Tint;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  illusClassName?: string;
  strokeWidth?: number;
}) {
  const p = firstImg(paths);
  if (p)
    return (
      <div className={`zoom bg-chaux-deep ${className}`}>
        <Image src={p.src} alt={alt} width={p.width} height={p.height} sizes={sizes} quality={75} priority={priority} fetchPriority={priority ? "high" : undefined} className={`h-full w-full object-cover ${imgClassName}`} />
      </div>
    );
  return (
    <div className={`flex items-center justify-center ${TINTS[tint]} ${className}`} data-photo-slot={paths[0]} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <Illus name={illus} className={illusClassName} strokeWidth={strokeWidth} />
    </div>
  );
}
