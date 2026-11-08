import * as React from "react";
import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";
import arrow from "@/design-system/agent-transaction-99232c/assets/icons/reflection-arrow.png";
export interface IconArrowRightProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
export const IconArrowRight = React.forwardRef<HTMLImageElement,IconArrowRightProps>(({className,alt="",...props},ref) => <img ref={ref} src={arrow} alt={alt} className={cn("size-5 shrink-0",className)} {...props} />);
IconArrowRight.displayName = "IconArrowRight";
