"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBookContext } from "../context/BookContext";

const genres = [
  {
    value: "fiction",
    label: "Fiction",
  },
  {
    value: "non-fiction",
    label: "Non-Fiction",
  },
  {
    value: "fantasy",
    label: "Fantasy",
  },
  {
    value: "mystery",
    label: "Mystery",
  },
  {
    value: "self-help",
    label: "Self-Help",
  },
  {
    value: "novel",
    label: "Novel",
  },
];

export function ComboSearchbox() {
  const [open, setOpen] = React.useState(false);
  const { value, setValue } = useBookContext();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between lg:text-[14px] text-[12px]"
        >
          {value
            ? genres.find((genres) => genres.value === value)?.label
            : "Search by genre..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search by genre..." />
          <CommandList>
            <CommandEmpty>No genre found.</CommandEmpty>
            <CommandGroup>
              {genres.map((genres) => (
                <CommandItem
                  key={genres.value}
                  value={genres.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === genres.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {genres.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
