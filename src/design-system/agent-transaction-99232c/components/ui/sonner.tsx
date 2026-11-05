import { forwardRef, useSyncExternalStore } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { cn } from "../../lib/utils";

export interface SolsticeToasterProps extends ToasterProps {}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Toast notifications, styled with Solstice tokens. Mount once near the root
 * of the app, then call `toast("...")` anywhere. Its hydration boundary travels
 * with the library, so consumers don't need a framework-specific ClientOnly.
 */
const Toaster = forwardRef<HTMLElement, SolsticeToasterProps>(function Toaster(
  { className, ...props },
  ref,
) {
  const hydrated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!hydrated) return null;

  return (
    <Sonner
      ref={ref}
      className={cn("font-sans", className)}
      position="bottom-right"
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm text-card-foreground shadow-md",
          title: "font-medium",
          description: "text-muted-foreground",
          icon: "text-primary",
          success: "[&_[data-icon]]:text-primary",
          error: "border-destructive/40 [&_[data-icon]]:text-destructive",
          warning: "[&_[data-icon]]:text-accent",
          actionButton:
            "ml-auto rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground",
          cancelButton: "ml-auto rounded-full bg-muted px-3 py-1 text-xs font-medium",
          closeButton:
            "rounded-full border border-border bg-card text-muted-foreground hover:text-foreground",
        },
      }}
      {...props}
    />
  );
});

export { Toaster };
export { toast } from "sonner";
