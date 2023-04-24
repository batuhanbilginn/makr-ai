"use client";
import * as React from "react";

import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    const inputValue = props.value;
    const defaultRow = 1;
    const maxRow = 10;
    const [rows, setRows] = useState(defaultRow);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Call regular handler function
      onChange?.(e);

      // Calculate number of rows
      const textareaLineHeight = 24;
      const previousRows = e.target.rows;
      e.target.rows = defaultRow; // reset number of rows in textarea
      const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);
      if (currentRows === previousRows) {
        e.target.rows = currentRows;
      }
      if (currentRows >= maxRow) {
        e.target.rows = maxRow;
        e.target.scrollTop = e.target.scrollHeight;
      }
      setRows(currentRows < maxRow ? currentRows : maxRow);
    };

    // Set Input Height When Value is Empty
    useEffect(() => {
      if (inputValue === "") {
        setRows(defaultRow);
      }
    }, [inputValue]);

    return (
      <textarea
        onChange={handleChange}
        value={inputValue}
        rows={rows}
        className={cn(
          "flex w-full resize-none rounded-md bg-transparent py-2 px-3 placeholder:text-sm placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
