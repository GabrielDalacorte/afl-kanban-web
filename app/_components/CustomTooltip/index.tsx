import { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { Arrow } from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

type CustomTooltipProps = {
  trigger: ReactNode;
  content: ReactNode;
  className?: string;
  dark?: boolean;
  cursor?: "cursor-text" | "cursor-default";
  side?: "top" | "right" | "bottom" | "left" | undefined;
  align?: "center" | "end" | "start" | undefined;
  sideOffset?: number | undefined;
  alignOffset?: number | undefined;
};

export const CustomTooltip = ({
  trigger,
  content,
  className,
  dark,
  cursor,
  side,
  align,
  sideOffset,
  alignOffset,
}: CustomTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(cursor || "cursor-pointer")}>{trigger}</span>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          dark ? "bg-gray-950 text-white" : "bg-white text-text",
          "max-w-[300px] font-normal",
          className
        )}
      >
        {content}
        <Arrow style={{ fill: dark ? "#1a1a1a" : "#ffffff" }} />
      </TooltipContent>
    </Tooltip>
  );
};
