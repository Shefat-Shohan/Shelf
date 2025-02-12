"use client";
import { EllipsisVertical } from "lucide-react";
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

import { toast } from "sonner";
import { db } from "@/drizzle";
import { bookList } from "@/drizzle/db/schema";
import { and, eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { Booklist } from "@/data/types";
import { useState } from "react";

export default function BinCard({
  bookListData,
  getDeletedBookList,
}: {
  bookListData: Booklist[];
  getDeletedBookList: () => void;
}) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  // move book to trash
  const handleRestore = async (bookId: number) => {
    try {
      setLoading(true);
      if (!bookId || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error("Missing parameters.");
      }
      await db
        .update(bookList)
        .set({ isDeleted: false })
        .where(
          and(
            eq(bookList.id, bookId),
            eq(bookList.createBy, user?.primaryEmailAddress?.emailAddress)
          )
        );
      getDeletedBookList();
      toast("Book is transfered to trash.");
    } catch (error) {
      console.error("Something went wrong", error);
      toast("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  // delete the book

  const handleDelete = async (bookId: number) => {
    try {
      setLoading(true);
      await db.delete(bookList).where(
        and(
          eq(bookList.id, bookId),
          // @ts-ignore
          eq(bookList.createBy, user?.primaryEmailAddress?.emailAddress)
        )
      );
      getDeletedBookList();
      toast("Book is transfered to trash.");
    } catch (error) {
      console.error("Something went wrong", error);
      toast("Something went wrong.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 md:gap-4">
      {bookListData.map((book) => (
        <div
          key={book.id}
          className="border px-6 py-4 rounded-lg md:flex items-center justify-between group "
        >
          <div>
            <h2 className="lg:text-lg lg:leading-8 text-[16px]">
              {book.bookName}
            </h2>
            <div className="flex gap-36 items-center justify-between">
              <p className="text-sm">
                Book Genre:{" "}
                <strong className="text-sm">{book.bookGenre}</strong>
              </p>
            </div>
          </div>
          <div className="sm:pt-4 flex md:flex-col place-items-end sm:flex-row-reverse justify-between">
            <Popover>
              <PopoverTrigger className="opacity-0 group-hover:opacity-100 group-hover:trnsition-durtion-400">
                <EllipsisVertical className="size-4" />
              </PopoverTrigger>
              <PopoverContent className=" border">
                <div>
                  {/* retrive book */}
                  <AlertDialog>
                    <AlertDialogTrigger className="flex justify-strt gap-4 w-full p-2 rounded">
                      <span className=" text-sm p-0">Retrieve</span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="">
                          Do you want to restore the book?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will move the book to your dashboard.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRestore(book.id)}
                        >
                          {loading ? "Retriving" : "Restore"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* delete book */}
                  <AlertDialog>
                    <AlertDialogTrigger className="flex justify-strt gap-4 w-full p-2 rounded">
                      <span className=" text-sm p-0">Delete</span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(book.id)}
                        >
                          {loading ? "Deleting" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </PopoverContent>
            </Popover>
            {/* edit */}
          </div>
        </div>
      ))}
    </div>
  );
}
