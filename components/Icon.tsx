import {
  Award, BookOpen, Briefcase, Building2, Calendar, ChartLine, Check, ClipboardCheck, Clock, Coffee, Compass, Drama, FileText,
  GraduationCap, Handshake, Headphones, Layers, Lightbulb, Mail, MapPin, MessageCircle, MessagesSquare, Mic, Phone, Rocket,
  Scale, Sprout, Target, Users, Presentation, PenLine, Languages, Gauge, Smile, ShieldCheck, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  award: Award, book: BookOpen, briefcase: Briefcase, building: Building2, calendar: Calendar, chart: ChartLine, check: Check,
  clipboard: ClipboardCheck, clock: Clock, coffee: Coffee, compass: Compass, drama: Drama, file: FileText, graduation: GraduationCap,
  handshake: Handshake, headphones: Headphones, layers: Layers, bulb: Lightbulb, mail: Mail, pin: MapPin, chat: MessageCircle,
  discussion: MessagesSquare, mic: Mic, phone: Phone, rocket: Rocket, scale: Scale, sprout: Sprout, target: Target, users: Users,
  presentation: Presentation, pen: PenLine, languages: Languages, gauge: Gauge, smile: Smile, shield: ShieldCheck,
};

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.75 }: { name: string; className?: string; strokeWidth?: number }) {
  const C = MAP[name] ?? Check;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden />;
}
