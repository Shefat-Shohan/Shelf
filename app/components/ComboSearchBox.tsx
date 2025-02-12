"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Search by genre..." />
      </SelectTrigger>
      <SelectContent>
        {genres.map((genre) => (
          <SelectItem key={genre.value} value={genre.value}>
            {genre.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
