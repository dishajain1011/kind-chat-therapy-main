import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  maxSelections = 3,
  className
}: MultiSelectProps) {
  const availableOptions = options.filter(option => !value.includes(option.value));

  const addOption = (optionValue: string) => {
    if (value.length < maxSelections && !value.includes(optionValue)) {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Selected options */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(optionValue => {
            const option = options.find(o => o.value === optionValue);
            return (
              <Badge
                key={optionValue}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {option?.label}
                <button
                  onClick={() => removeOption(optionValue)}
                  className="ml-2 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Available options */}
      {availableOptions.length > 0 && value.length < maxSelections && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {placeholder} ({value.length}/{maxSelections} selected)
          </p>
          <div className="flex flex-wrap gap-2">
            {availableOptions.map(option => (
              <button
                key={option.value}
                onClick={() => addOption(option.value)}
                className="px-3 py-2 text-sm bg-secondary hover:bg-secondary-soft border border-border rounded-lg transition-colors hover:border-primary/50"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {value.length >= maxSelections && (
        <p className="text-sm text-muted-foreground">
          Maximum {maxSelections} selections reached
        </p>
      )}
    </div>
  );
}