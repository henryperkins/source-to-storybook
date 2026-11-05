// Solstice design system — public barrel. Keep in sync with src/components/ui/.
// The side-effect CSS import is what delivers the theme (tokens, fonts, base
// styles) to consumers that attach this library.
import "./styles.css";
export { Toaster, toast, type SolsticeToasterProps } from "./components/ui/sonner";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/ui/breadcrumb";
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./components/ui/pagination";
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "./components/ui/popover";
export { Calendar, type CalendarProps } from "./components/ui/calendar";
export { DatePicker, type DatePickerProps } from "./components/ui/date-picker";
export { Button, buttonVariants, type ButtonProps } from "./components/ui/button";
export { Input, type InputProps } from "./components/ui/input";
export { Textarea, type TextareaProps } from "./components/ui/textarea";
export { Label } from "./components/ui/label";
export { Checkbox } from "./components/ui/checkbox";
export { Switch } from "./components/ui/switch";
export { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
export { Slider } from "./components/ui/slider";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
export { Badge, badgeVariants, type BadgeProps } from "./components/ui/badge";
export { Avatar, AvatarImage, AvatarFallback, avatarVariants, avatarFallbackVariants, type AvatarProps, type AvatarFallbackProps } from "./components/ui/avatar";
export { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetVariants,
  type SheetContentProps,
} from "./components/ui/sheet";
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogActionProps,
} from "./components/ui/alert-dialog";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./components/ui/table";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./components/ui/tooltip";
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./components/ui/accordion";
export { Separator } from "./components/ui/separator";
export { Skeleton } from "./components/ui/skeleton";
export { Progress } from "./components/ui/progress";
export {
  StatusBadge,
  statusBadgeVariants,
  STATUS_LABELS,
  type StatusBadgeProps,
  type TransactionStatus,
} from "./components/ui/status-badge";
export { Amount, amountVariants, formatAmount, type AmountProps, type FormatAmountOptions } from "./components/ui/amount";
export {
  ActivityTimeline,
  ActivityTimelineItem,
  type ActivityTimelineProps,
  type ActivityTimelineItemProps,
} from "./components/ui/activity-timeline";
export { ApprovalCard, type ApprovalCardProps, type ApprovalState } from "./components/ui/approval-card";
export {
  AgentActionCard,
  canApproveAgentAction,
  type AgentActionActor,
  type AgentActionCardProps,
  type AgentActionParameter,
  type AgentDecisionEntry,
  type PolicyCheck,
  type PolicyCheckResult,
} from "./components/ui/agent-action-card";
export { SOLSTICE_VERSION } from "./version";
export { cn } from "./lib/utils";
