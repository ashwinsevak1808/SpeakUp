"use client";
/**
 * Hugeicons for the student and trainer areas.
 * Each export keeps the name the components already use, so swapping the icon set is one file.
 * Size comes from the className (e.g. "h-5 w-5"); colour from the text colour.
 */
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import * as H from "@hugeicons/core-free-icons";

type Props = { className?: string; strokeWidth?: number; "aria-label"?: string; "aria-hidden"?: boolean | "true" | "false" };
export type IconType = (p: Props) => React.ReactElement;

const mk = (icon: IconSvgElement): IconType => {
  const C = ({ className, strokeWidth = 1.8, ...rest }: Props) => (
    <HugeiconsIcon icon={icon} size={24} strokeWidth={strokeWidth} color="currentColor" className={className} aria-hidden={rest["aria-label"] ? undefined : true} {...rest} />
  );
  return C;
};

export const LayoutDashboard = mk(H.DashboardSquare01Icon);
export const Map = mk(H.Route01Icon);
export const CalendarDays = mk(H.Calendar03Icon);
export const CalendarPlus = mk(H.CalendarAdd01Icon);
export const UserRound = mk(H.UserIcon);
export const Users = mk(H.UserGroupIcon);
export const RotateCcw = mk(H.RepeatIcon);
export const BookOpen = mk(H.BookOpen01Icon);
export const Lightbulb = mk(H.Idea01Icon);
export const Award = mk(H.Award01Icon);
export const Settings = mk(H.Settings02Icon);
export const LogOut = mk(H.Logout01Icon);
export const Menu = mk(H.Menu01Icon);
export const X = mk(H.Cancel01Icon);
export const Flame = mk(H.FireIcon);
export const Star = mk(H.StarIcon);
export const Check = mk(H.Tick02Icon);
export const Play = mk(H.PlayIcon);
export const Lock = mk(H.SquareLock02Icon);
export const Video = mk(H.Video01Icon);
export const Mic = mk(H.Mic01Icon);
export const MicOff = mk(H.MicOff01Icon);
export const Flag = mk(H.Flag02Icon);
export const ArrowRight = mk(H.ArrowRight02Icon);
export const ArrowLeft = mk(H.ArrowLeft02Icon);
export const ChevronRight = mk(H.ArrowRight01Icon);
export const ChevronLeft = mk(H.ArrowLeft01Icon);
export const Volume2 = mk(H.VolumeHighIcon);
export const Square = mk(H.StopIcon);
export const ShieldCheck = mk(H.SecurityCheckIcon);
export const ExternalLink = mk(H.LinkSquare02Icon);
export const MapPin = mk(H.Location01Icon);
export const Sun = mk(H.Sun03Icon);
export const PenLine = mk(H.PencilEdit02Icon);
export const Target = mk(H.Target02Icon);
export const Medal = mk(H.Medal01Icon);
export const Trophy = mk(H.ChampionIcon);
export const Footprints = mk(H.Rocket01Icon);
export const Plus = mk(H.Add01Icon);
export const Trash2 = mk(H.Delete02Icon);
export const Save = mk(H.FloppyDiskIcon);
export const Radio = mk(H.LiveStreaming02Icon);
export const Printer = mk(H.PrinterIcon);
export const Circle = mk(H.CircleIcon);
export const Eye = mk(H.EyeIcon);
export const EyeOff = mk(H.ViewOffSlashIcon);
export const Sparkles = mk(H.SparklesIcon);
export const Clock = mk(H.Clock01Icon);
export const Zap = mk(H.FlashIcon);
export const Bell = mk(H.Notification03Icon);
export const Search = mk(H.Search01Icon);
export const Help = mk(H.HelpCircleIcon);
export const SidebarToggle = mk(H.SidebarLeftIcon);
export const ArrowUpRight = mk(H.ArrowUpRight01Icon);
export const Unfold = mk(H.UnfoldMoreIcon);
export const Grad = mk(H.Mortarboard01Icon);
export const CheckCircle = mk(H.CheckmarkCircle02Icon);
export const ChevronDown = mk(H.ArrowDown01Icon);
export const TaskDone = mk(H.TaskDone01Icon);
