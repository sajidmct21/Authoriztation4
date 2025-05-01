import BookJson from "./bookstore.book.json" with { type: "json" };
import { Book } from "./models/book.model.js";

export const seedBooksData = async () => {
  try {
    // connection to database
    // query
    await Book.deleteMany({});
    await Book.insertMany(BookJson);
    console.log("Data seeded successfully");
  } catch (error) {
    console.log("Error", error);
  }
};
