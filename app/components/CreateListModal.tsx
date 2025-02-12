"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { genres } from "@/data";
import { db } from "@/drizzle";
import { bookList } from "@/drizzle/db/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useBookContext } from "../context/BookContext";
import { useState } from "react";

export function CreteListModal() {
  const { user } = useUser();
  const [isDisble, setIsDisable] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { getBookList } = useBookContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      genre: "",
    },
  });
  const selectedGenre = watch("genre");
  const handleAddBook = async (data: { name: string; genre: string }) => {
    if (!data.name || !data.genre) {
      alert("Please enter a book name and select a genre.");
      return;
    }

    try {
      setIsDisable(true);
      await db
        .insert(bookList)
        // @ts-ignore
        .values({
          bookName: data.name,
          bookGenre: data.genre,
          bookStatus: "To Read",
          createBy: user?.primaryEmailAddress?.emailAddress,
          cretedAt: new Date(),
        });
      getBookList();
      toast("Book is added to shelf");
    } catch (error) {
      toast("Couldn't add the book to shelf");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Book</DialogTitle>
          <DialogDescription>
            What book you want to read today?
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleAddBook)}
          className="grid gap-4 py-4"
        >
          {/* Book Name Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Book Name
            </Label>
            <Input
              id="name"
              placeholder="Enter book name"
              className="col-span-3"
              {...register("name", { required: "Book name is required" })}
            />
          </div>
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}

          {/* Book Genre Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right">
              Book Genre
            </Label>
            <Select
              onValueChange={(value) => setValue("genre", value)}
              value={selectedGenre}
              {...register("genre", { required: "Please select a genre" })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Book Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {genres.map((item) => (
                    <SelectItem key={item.id} value={item.genre}>
                      {item.genre}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {errors.genre && (
            <span className="text-red-500">{errors.genre.message}</span>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isDisble}>
              Add Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
