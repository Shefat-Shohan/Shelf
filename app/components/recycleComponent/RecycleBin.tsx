"use client";
import { ModeToggle } from "@/app/components/ModeToggle";
import { Booklist } from "@/data/types";
import { db } from "@/drizzle";
import { bookList } from "@/drizzle/db/schema";
import { useUser } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import BinCard from "./BinCard";

export default function RecycleBin() {
  const [bookListData, setBookListData] = useState<Booklist[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  console.log(bookListData.length);

  const getDeletedBookList = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const response = await db
        .select()
        .from(bookList)
        .where(
          and(
            // @ts-ignore
            eq(bookList.createBy, user?.primaryEmailAddress?.emailAddress),
            eq(bookList.isDeleted, true)
          )
        )
        .orderBy(desc(bookList.id));
      setBookListData(response);
    } catch (error) {
      console.error("Error fetching the book list", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) getDeletedBookList();
  }, [user]);

  return (
    <div className="md:py-6 md:px-6 px-4 py-3 w-full">
      <div className="md:flex md:flex-row md:items-center flex-col items-baseline justify-between md:pb-6 pb-3">
        <div className="flex justify-between items-center pb-3 md:pb-0">
          <h2 className="font-bold lg:text-3xl md:text-xl text-lg">Recycle</h2>
          <div className="md:hidden">
            <ModeToggle />
          </div>
        </div>
        <div className="flex items-center justify-between md:gap-4">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-6">
        {bookListData.length > 0 ? (
          <BinCard
            bookListData={bookListData}
            getDeletedBookList={getDeletedBookList}
          />
        ) : (
          <p>Your Trash is empty.</p>
        )}
      </div>
    </div>
  );
}
