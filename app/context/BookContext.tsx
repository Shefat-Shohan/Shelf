"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/drizzle";
import { bookList } from "@/drizzle/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Booklist, genreType } from "@/data/types";

interface BookContextType {
  bookListData: Booklist[];
  loading: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  getBookList: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [bookListData, setBookListData] = useState<Booklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const { user } = useUser();

  const getBookList = async () => {
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
            eq(bookList.isDeleted, false)
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
    if (user) getBookList();
  }, [user]);

  return (
    <BookContext.Provider
      value={{ bookListData, loading, setValue, value, getBookList }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBookContext must be used within a BookProvider");
  }
  return context;
};
