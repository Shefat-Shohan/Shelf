"use client";
import { useState } from "react";
import { toast } from "sonner";
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
import { bookStatus, genres } from "@/data";
import { bookList } from "@/drizzle/db/schema";
import { useUser } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/drizzle";
import { and, eq } from "drizzle-orm";
import { useBookContext } from "../context/BookContext";
import { bookTypes } from "@/data/types";

export type EditBooksProps = {
  book: bookTypes;
};

export default function EditBooks({ book }: any) {
  console.log(book);
  const [selectedGenre, setSelectedGenre] = useState<string>(
    book.bookGenre || ""
  );
  const [selectedBookStatus, setSelectedBookStatus] = useState<string>(
    book.bookGenre || ""
  );
  const [bookName, setBookName] = useState<string>(book.bookName || "");
  const [open, setOpen] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState(false);
  const { user } = useUser();
  const { getBookList } = useBookContext();
  // edit booklist function
  const handleEditBook = async (bookId: number) => {
    try {
      setIsDisable(true);
      await db
        .update(bookList)
        .set({
          bookName: bookName,
          bookGenre: selectedGenre,
          bookStatus: selectedBookStatus,
        })
        .where(
          and(
            eq(bookList.id, bookId),
            // @ts-ignore
            eq(bookList.createBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      getBookList();
      toast("Book edited successfully");
    } catch (error) {
      console.log("Couldn't update the book.", error);
      toast("Couldn't update the book.");
    }
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 hover:bg-transparent">
          Edit Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>Edit your book details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Book Name Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Book Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              defaultValue={book.bookName}
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>

          {/* Book Genre Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right">
              Book Genre
            </Label>
            <Select
              onValueChange={setSelectedGenre}
              defaultValue={book.bookGenre}
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
          {/* select bookStatus */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right">
              Book Status
            </Label>
            <Select
              onValueChange={setSelectedBookStatus}
              defaultValue={book.bookStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Book Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {bookStatus.map((item) => (
                    <SelectItem key={item.id} value={item.status}>
                      {item.status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleEditBook(book.id)} disabled={isDisable}>
            Update Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
