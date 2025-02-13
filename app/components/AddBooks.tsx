"use client";
import { CreateListModal } from "./CreateListModal";
import { ModeToggle } from "./ModeToggle";
import { ComboSearchbox } from "./ComboSearchBox";
import { useBookContext } from "../context/BookContext";
import { db } from "@/drizzle";
import { bookList } from "@/drizzle/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { Suspense, useEffect, useState } from "react";
import { Booklist } from "@/data/types";
import dynamic from "next/dynamic";
import CardLoadingSkelaton from "./CardLoadingSkelaton";

export default function AddBooks() {
  const { value } = useBookContext();
  const [searchItem, setSearchItem] = useState<Booklist[]>([]);
  const { user } = useUser();
  const { bookListData } = useBookContext();

  useEffect(() => {
    user && serachByGenre();
  }, [value]);

  const serachByGenre = async () => {
    if (!value.trim()) {
      setSearchItem([]); // reset search result
      return;
    }

    try {
      const response = await db
        .select()
        .from(bookList)
        .where(
          and(
            // @ts-ignore
            eq(bookList.createBy, user?.primaryEmailAddress?.emailAddress),
            eq(bookList.isDeleted, false),
            value ? eq(sql`LOWER(${bookList.bookGenre})`, value) : undefined
          )
        )
        .orderBy(desc(bookList.id));
      setSearchItem(response);
    } catch (error) {
      console.log("Couldn't find the related seaarch data.");
    }
  };
  const BookCard = dynamic(() => import("@/app/components/BookCard"));
  return (
    <div className="md:py-6 md:px-6 px-4 py-3 w-full">
      <div className="md:flex md:flex-row md:items-center flex-col items-baseline justify-between md:pb-6 pb-3">
        <div className="flex justify-between items-center pb-3 md:pb-0">
          <h2 className="font-bold md:text-3xl text-xl">Dashboard</h2>
          <div className="md:hidden">
            <ModeToggle />
          </div>
        </div>
        <div className="flex items-center justify-between md:gap-4">
          <ComboSearchbox />
          <CreateListModal />
          <div className="hidden md:block">
            <ModeToggle />
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-6">
        <Suspense fallback={<CardLoadingSkelaton />}>
          {searchItem.length > 0 ? (
            <BookCard bookListData={searchItem} />
          ) : bookListData.length > 0 ? (
            <BookCard bookListData={bookListData} />
          ) : (
            <p>Your shelf is empty.</p>
          )}
        </Suspense>
      </div>
    </div>
  );
}

// https://www.google.com/search?sca_esv=14f1bb877078fccd&rlz=1C1JSBI_enUS1081US1081&q=AME%20ZION%20Church%20Growth%20and%20Development&udm=2&fbs=ABzOT_CWdhQLP1FcmU5B0fn3xuWpA-dk4wpBWOGsoR7DG5zJBr1qLlHFB6ZBcx-Arq68_wfw0s-Sy4efUF8x4O2idyUNfaGVVL5hKNY4i90H-gJ4DP6MVIrg7iONLGu5SiLctWRy8jliy5WN9gHuU80gzmbt_aXjHpZL44gvrnzjLZvNBrAJkSOm-MWwaQQWzcrdnvQwjMbF603MC-IsHbgO4xV9IWky-g&sa=X&ved=2ahUKEwiVl4SKzbSLAxXZ78kDHQViJNUQtKgLegQIFxAB&biw=1536&bih=695&dpr=1.25&authuser=2#vhid=MZqoHd9vEjRV3M&vssid=mosaic
