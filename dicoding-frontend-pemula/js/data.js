const STORAGE_KEY = "BOOK_SHELF";
 
let books = [];
 
function isStorageExist() /* boolean */ {
   if(typeof(Storage) === undefined){
       alert("Browser kamu tidak mendukung local storage");
       return false
   }
   return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}
  
 function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    
    let data = JSON.parse(serializedData);
    if (data !== null) books = data;
  
    document.dispatchEvent(new Event("ondataloaded"));
 }
  
 function updateDataToStorage() {
    if(isStorageExist())
        saveData();
 }

 function composeBookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
 }

 function findBook(bookId) {
    for(book of books){
        if(book.id === bookId)
            return book;
    }
    return null;
 }
  
  
 function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if(book.id === bookId)
            return index;
  
        index++;
    }
  
    return -1;
 }
 
function refreshDataFromBooks() {
    let listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
      
    for (book of books){
        let bookInfo = book.author + " | " + book.year;

        let newBook = makeBook(book.title, bookInfo, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;
   
        if(book.isCompleted){
            listCompleted.append(newBook);
        } else {
            listIncompleted.append(newBook);
        }
    }
}