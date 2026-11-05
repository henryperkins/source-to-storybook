import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/design-system/agent-transaction-99232c/lib/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: { size: { sm: "h-8 w-8 text-xs", default: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" } },
  defaultVariants: { size: "default" },
});

const avatarFallbackVariants = cva("flex h-full w-full items-center justify-center rounded-full font-medium", {
  variants: {
    tone: {
      secondary: "bg-secondary text-secondary-foreground",
      primary: "bg-primary text-primary-foreground",
      accent: "bg-accent text-accent-foreground",
      muted: "bg-muted text-muted-foreground",
    },
  },
  defaultVariants: { tone: "secondary" },
});

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    VariantProps<typeof avatarFallbackVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, tone, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(avatarFallbackVariants({ tone }), className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback, avatarVariants, avatarFallbackVariants };
