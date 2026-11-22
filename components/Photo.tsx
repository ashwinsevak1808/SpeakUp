import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Every photo on the site goes through this component.
 * Files live in /public/images/<name>.jpg. Replace a file (same name) and the site updates.
 */
export function Photo({
  name,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
}: {
  name: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-100", className)}>
      <Image src={`/images/${name}.jpg`} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
