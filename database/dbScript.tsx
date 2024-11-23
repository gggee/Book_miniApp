// const createUsersTable = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS Users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT UNIQUE NOT NULL,
//         email TEXT UNIQUE NOT NULL,
//         password TEXT NOT NULL
//       );`
//     );
//   });
// };

// const createBooksTable = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS Books (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         author TEXT NOT NULL,
//         publishedDate TEXT,
//         description TEXT,
//         coverImage TEXT
//       );`
//     );
//   });
// };

// const createSavedBooksTable = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS SavedBooks (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         userId INTEGER NOT NULL,
//         bookId INTEGER NOT NULL,
//         status TEXT,  -- Например, "Читаю", "Запланировал", "Прочитал"
//         FOREIGN KEY (userId) REFERENCES Users (id),
//         FOREIGN KEY (bookId) REFERENCES Books (id)
//       );`
//     );
//   });
// };

// const createCategoriesTable = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS Categories (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT UNIQUE NOT NULL
//       );`
//     );
//   });
// };

// const createBookCategoriesTable = () => {
//   db.transaction(tx => {
//     tx.executeSql(
//       `CREATE TABLE IF NOT EXISTS BookCategories (
//         bookId INTEGER NOT NULL,
//         categoryId INTEGER NOT NULL,
//         FOREIGN KEY (bookId) REFERENCES Books (id),
//         FOREIGN KEY (categoryId) REFERENCES Categories (id),
//         PRIMARY KEY (bookId, categoryId)
//       );`
//     );
//   });
// };

// const initializeDatabase = () => {
//   createUsersTable();
//   createBooksTable();
//   createSavedBooksTable();
//   createCategoriesTable();
//   createBookCategoriesTable();
// };

