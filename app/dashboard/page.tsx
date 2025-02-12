import AddBooks from "../components/AddBooks";
import { BookProvider } from "../context/BookContext";

export default function page() {
  return (
    <BookProvider>
      <AddBooks />
    </BookProvider>
  );
}
