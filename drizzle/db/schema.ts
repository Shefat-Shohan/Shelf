import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const bookList = pgTable("booklist", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  bookName: varchar("bookName").notNull(),
  bookGenre: varchar("bookGenre").notNull(),
  bookSummary: varchar("booksummary").default(""),
  bookStatus: varchar("bookStatus").default(""),
  createBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  isDeleted: boolean("isDeleted").notNull().default(false),
});
