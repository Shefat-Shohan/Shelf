export interface Book {
  name: string;
  genre: string;
}
export type Booklist = {
  id: number;
  bookName: string;
  bookGenre: string;
  bookSummary?: string | null;
  bookStatus?: string | null;
  createBy: string;
  createdAt: Date;
  isDeleted: boolean;
};

export type bookTypes = {
  id: number;
  bookName: string;
  bookGenre: string;
  bookSummary: string | null;
  bookStatus?: string | null;
  createBy: string;
  createdAt: string;
  isDeleted: boolean;
};

export type genreType = {
  value: string;
  label: string;
};
