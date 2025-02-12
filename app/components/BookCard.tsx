"use client";
import { AwardIcon, EllipsisVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditBooks from "./EditBooks";
import { toast } from "sonner";
import { db } from "@/drizzle";
import { bookList } from "@/drizzle/db/schema";
import { and, ConsoleLogWriter, eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useBookContext } from "../context/BookContext";
import { Booklist } from "@/data/types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { GenerateAIBookSummary } from "../services/aiModel";
import { prompts } from "@/data";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
export default function BookCard({
  bookListData,
}: {
  bookListData: Booklist[];
}) {
  const { user } = useUser();
  const { getBookList } = useBookContext();
  const [loading, setLoading] = useState(false);
  const [bookSummary, setBookSummary] = useState<string | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // move book to trash

  const handleDelete = async (bookId: number) => {
    try {
      if (!bookId || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error("Missing parameters.");
      }
      await db
        .update(bookList)
        .set({ isDeleted: true })
        .where(
          and(
            eq(bookList.id, bookId),
            eq(bookList.createBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      getBookList();
      toast("Book is transfered to trash.");
    } catch (error) {
      console.error("Something went wrong", error);
      toast("Something went wrong.");
    }
  };

  // check if book summary already exist
  const checkBookSummary = async (bookId: number) => {
    try {
      const existingBookSummary = await db
        .select({ summary: bookList.bookSummary })
        .from(bookList)
        .where(eq(bookList.id, bookId))
        .then((rows) => rows[0]?.summary || null);
      setBookSummary(existingBookSummary);
      setButtonDisabled(!!existingBookSummary);
    } catch (error) {
      console.log("Error check book summary", error);
    }
  };

  // summarize the book with ai.
  const summarizeBook = async (bookName: string, bookId: number) => {
    if (bookSummary) {
      toast("Summary already exists.");
      return;
    }

    setLoading(true);
    try {
      const postData = String(prompts) + bookName;
      const data = await GenerateAIBookSummary(postData);
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!result) throw new Error("No summary generated.");

      await db
        .update(bookList)
        .set({ bookSummary: result })
        .where(eq(bookList.id, bookId));

      toast("Book summarized successfully.");
      setBookSummary(result);
      setButtonDisabled(true);
    } catch (error) {
      console.error("Error summarizing book:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-4">
      {bookListData.map((book) => (
        <div
          key={book.id}
          className="border px-6 py-4 rounded-lg md:flex items-center justify-between group "
        >
          <div className="flex-[50%] flex-wrap">
            <div className="flex items-start gap-2">
              <div>
                <h2 className="lg:text-lg lg:leading-8 text-[14px]">
                  {book.bookName}
                </h2>
                <div className="flex gap-36 items-center justify-between">
                  <p className="text-xs">
                    Book Genre:{" "}
                    <strong className="text-xs">{book.bookGenre}</strong>
                  </p>
                </div>
              </div>
              {book.bookStatus == "Reading" ? (
                <p className="inline-flex text-sm px-2 bg-black rounded-full border mt-2 md:mt-1.5">
                  <motion.span
                    animate={{
                      backgroundPositionX: "-100%",
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                      repeatType: "loop",
                    }}
                    className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF)] [background-size:200%] text-transparent bg-clip-text text-xs"
                  >
                    {book.bookStatus}
                  </motion.span>
                </p>
              ) : (
                <Badge
                  variant="secondary"
                  className="whitespace-nowrap mt-2 md:mt-1.5"
                >
                  {book.bookStatus}
                </Badge>
              )}
            </div>
          </div>
          <div className="sm:pt-4 flex md:flex-col place-items-end sm:flex-row-reverse justify-between">
            <Popover>
              <PopoverTrigger className="lg:opacity-0 lg:group-hover:opacity-100 group-hover:trnsition-durtion-400">
                <EllipsisVertical className="size-4" />
              </PopoverTrigger>
              <PopoverContent className=" border">
                <div>
                  {/* delete action icons */}
                  <AlertDialog>
                    <AlertDialogTrigger className="flex justify-strt gap-4 w-full p-2 rounded">
                      <span className=" text-sm p-0">Trash</span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will move your book to recycle bin. You
                          can restore or permanently delete from there recycle
                          bin.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(book.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* edit action icons */}
                  <AlertDialog>
                    <EditBooks book={book} />
                  </AlertDialog>
                </div>
              </PopoverContent>
            </Popover>
            {/* edit */}
            <Drawer>
              <DrawerTrigger>
                <button
                  onClick={() => checkBookSummary(book.id)}
                  className="bg-[#b587ff] text-white text-xs rounded-full px-2 py-1 mt-4"
                >
                  summarize
                </button>
              </DrawerTrigger>
              <DrawerContent className="w-full">
                <div className="max-w-7xl mx-auto w-full">
                  <DrawerHeader>
                    <div className="lg:flex justify-between items-center">
                      <div>
                        <DrawerTitle>{book.bookName}</DrawerTitle>
                        <DrawerDescription>
                          <p className="mt-1 text-sm">
                            Book Genre: {""}
                            <span className="font-semibold">
                              {book.bookGenre}
                            </span>
                          </p>
                        </DrawerDescription>
                      </div>
                      <button
                        onClick={() => summarizeBook(book.bookName, book.id)}
                        disabled={loading || buttonDisabled}
                        className="bg-[#8A43FC] text-white  rounded-full lg:text-[16px] text-sm px-6 py-4 hover:bg-[#8e4ff3] disabled:bg-[#ccacff] md:mt-4 mt-4"
                      >
                        {loading ? "Summarizing..." : "Summarize the book"}
                      </button>
                    </div>
                  </DrawerHeader>
                  <ScrollArea className="h-[400px] lg:h-auto w-full rounded-md ">
                    <p className="my-6 mx-4">{bookSummary}</p>
                  </ScrollArea>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      ))}
    </div>
  );
}
