import Link from "next/link";
import { Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ variant = 'default' }: { variant?: 'default' | 'dark' }) {
  const isDark = variant === 'dark';
  return (
    <Link href="/" className="flex items-center gap-2 group" prefetch={false}>
      <Mountain className={cn(
        "h-6 w-6",
        isDark 
          ? "text-primary-foreground group-hover:text-muted-foreground" 
          : "text-primary group-hover:text-primary-foreground"
      )} />
      <span className={cn(
        "text-xl font-headline font-bold",
        isDark 
          ? "text-primary-foreground group-hover:text-muted-foreground"
          : "text-primary group-hover:text-primary-foreground"
      )}>
        RoomVerse
      </span>
    </Link>
  );
}
