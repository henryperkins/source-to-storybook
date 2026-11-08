import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import artwork from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-botanical-card-study.png";
export interface TarotBotanicalCardFaceProps extends React.HTMLAttributes<HTMLElement> { position: string; number: string; name: string; orientation?: "Upright" | "Reversed"; }
/** Botanical card specimen; orientation is communicated in text and image. */
export const TarotBotanicalCardFace = React.forwardRef<HTMLElement,TarotBotanicalCardFaceProps>(({position,number,name,orientation="Upright",children,className,...props},ref) => <figure ref={ref} className={cn("space-y-2 rounded-lg border border-border bg-card p-3 text-card-foreground",className)} {...props}><p className="font-sans text-xs">{position}</p><p className="font-sans text-xl">{number}</p><img src={artwork} alt="" className={cn("aspect-[3/2] w-full rounded-sm object-contain",orientation === "Reversed" && "rotate-180")} /><figcaption className="space-y-1 font-sans"><p className="text-sm font-semibold">{name}</p><p className="text-xs">{orientation}</p></figcaption>{children}</figure>);
TarotBotanicalCardFace.displayName = "TarotBotanicalCardFace";
