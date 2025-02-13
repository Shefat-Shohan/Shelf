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
import { useEffect, useRef, useState } from "react";
import { suggestBookType } from "@/data/types";

export function CreateListModal() {
  const { user } = useUser();
  const [isDisble, setIsDisable] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const { getBookList } = useBookContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    watch,
    reset,
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
      reset({ name: "", genre: "" });
      setQuery("");
      getBookList();
      setIsDisable(false);
      toast("Book is added to shelf");
    } catch (error) {
      toast("Couldn't add the book to shelf");
    }
    setOpen(false);
  };
  // search result ref
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        // @ts-ignore
        !dropdownRef.current.contains(event.target as Node) &&
        // @ts-ignore
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query) {
      setShowDropdown(false);
      return;
    }
    const delaySearch = setTimeout(() => {
      fetchBook(query);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [query]);

  // fetch to google book api
  const fetchBook = async (searchQuery: string) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      searchQuery
    )}&fields=items(volumeInfo/title,volumeInfo/authors)&maxResults=5`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data.items || []);
      setShowDropdown(data.items && data.items.length > 0);
    } catch (error) {
      console.log("Something went wrong.", error);
    }
  };
  const handleSelectBook = (title: string) => {
    setQuery(title);
    setValue("name", title);
    setShowDropdown(false);
  };

  console.log("books", books);
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
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="name" className="text-right">
              Book Name
            </Label>
            <div className="col-span-3 relative">
              <Input
                id="name"
                placeholder="Enter book name"
                className="w-full"
                {...register("name", { required: "Book name is required" })}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowDropdown(books.length > 0)}
                ref={inputRef}
              />

              {/* Dropdown Suggestions */}
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute w-full bg-white rounded-md shadow-lg mt-1 z-10 last:border-none"
                >
                  {books.map((book: suggestBookType, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer border-b"
                      onClick={() => handleSelectBook(book.volumeInfo.title)}
                    >
                      <h3 className="text-[16px] text-black">
                        {book.volumeInfo.title}
                      </h3>
                      <p className="text-xs text-black">
                        {book.volumeInfo.authors?.[0] || "Unknown Author"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
