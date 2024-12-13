import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/utils";

interface ViewModalProps {
  title: string;
  action: string;
  onAction: () => void;
  secondaryAction?: string;
  onSecondaryAction?: () => void;
  children: React.ReactNode;
  userId?: string;
  isActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  isReportViewer?: boolean;
  tertiaryAction?: string;
  isTertiaryActionDisabled?: boolean;
  onTertiaryAction?: () => void;
}

export default function ViewerModal({
  title,
  action,
  onAction,
  secondaryAction,
  onSecondaryAction,
  children,
  isActionDisabled,
  isSecondaryActionDisabled,
  isReportViewer,
  tertiaryAction,
  isTertiaryActionDisabled,
  onTertiaryAction,
}: ViewModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>{action}</Button>
      </DialogTrigger>
      {isReportViewer ? (
        <DialogContent
          className={cn(
            "overflow-y-auto",
            "w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh]"
          )}
        >
          <DialogHeader>
            <h2>{title}</h2>
          </DialogHeader>
          <div className="overflow-y-auto no-scrollbar h-[calc(100vh-200px)]">
            {children}
          </div>
          <Button
            disabled={isActionDisabled}
            onClick={() => {
              onAction();
            }}
          >
            {action}
          </Button>
          {secondaryAction && onSecondaryAction && (
            <Button
              disabled={isSecondaryActionDisabled}
              onClick={() => {
                onSecondaryAction();
              }}
            >
              {secondaryAction}
            </Button>
          )}
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <h2>{title}</h2>
          </DialogHeader>
          <div className="overflow-y-auto no-scrollbar h-[calc(100vh-200px)]">
            {children}
          </div>
          <Button
            disabled={isActionDisabled}
            onClick={() => {
              onAction();
            }}
          >
            {action}
          </Button>
          {secondaryAction && onSecondaryAction && (
            <Button
              disabled={isSecondaryActionDisabled}
              onClick={() => {
                onSecondaryAction();
              }}
            >
              {secondaryAction}
            </Button>
          )}
          {tertiaryAction && onTertiaryAction && (
            <Button
              disabled={isTertiaryActionDisabled}
              onClick={() => {
                onTertiaryAction();
              }}
            >
              {tertiaryAction}
            </Button>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
