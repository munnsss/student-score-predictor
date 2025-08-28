import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MLCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  glowing?: boolean;
}

export function MLCard({ title, description, children, className, glowing = false }: MLCardProps) {
  return (
    <Card className={cn(
      "ml-card border rounded-xl p-6",
      glowing && "animate-pulse-glow",
      className
    )}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}