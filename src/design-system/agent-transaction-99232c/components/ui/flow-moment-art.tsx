import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import keepingPaper from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-keeping-paper.png";
import returningPaper from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-returning-paper.png";
import reflectingPaper from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-reflecting-paper.png";
import keepingEvening from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-keeping-evening.png";
import returningEvening from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-returning-evening.png";
import reflectingEvening from "@/design-system/agent-transaction-99232c/assets/illustrations/reflection-reflecting-evening.png";
const art={paper:{Keeping:keepingPaper,Returning:returningPaper,Reflecting:reflectingPaper},evening:{Keeping:keepingEvening,Returning:returningEvening,Reflecting:reflectingEvening}};
export interface FlowMomentArtProps extends React.ImgHTMLAttributes<HTMLImageElement> { moment?: "Keeping" | "Returning" | "Reflecting"; variant?: "paper" | "evening"; size?: "sm" | "default" | "lg"; }
/** Original supplied botanical moments, with no cropping or regeneration. */
export const FlowMomentArt = React.forwardRef<HTMLImageElement,FlowMomentArtProps>(({ moment="Reflecting",variant="paper",size="default",alt="",className,...props },ref) => <img ref={ref} src={art[variant][moment]} alt={alt} className={cn("object-contain",{sm:"size-16",default:"size-32",lg:"h-64 w-full"}[size],className)} {...props} />);
FlowMomentArt.displayName = "FlowMomentArt";
