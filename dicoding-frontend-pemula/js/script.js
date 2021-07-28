document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});

document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        searchBook();
    });
});

const radioButtons = document.getElementsByName("inputBookIsCompleted");
const bookShelf = document.getElementById("bookShelf");
for (let radioButton of radioButtons) {
    radioButton.addEventListener("change", function() {
        if (radioButton.value == "true") {
            bookShelf.innerText = "Selesai Dibaca";
        } else {
            bookShelf.innerText = "Belum Selesai Dibaca";
        }
    });
}

const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookInfo = bookAuthor + " | " + bookYear;

    let isCompleted = null;
    const radios = document.getElementsByName("inputBookIsCompleted");

    for (let radio of radios) {
        if (radio.checked) {
            isCompleted = (radio.value === "true");
        }
    }

    const book = makeBook(bookTitle, bookInfo, isCompleted);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isCompleted);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    let bookList = null;

    if (isCompleted) {
        bookList = document.getElementById(COMPLETED_LIST_BOOK_ID);
    } else {
        bookList = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    }

    bookList.append(book);
    updateDataToStorage();
}


function makeBook(title, info, isCompleted) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = title;

    const bookInfo = document.createElement("p");
    bookInfo.innerText = info;

    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.append(bookTitle, bookInfo);

    if (isCompleted) {
        bookItem.append(createCancelButton());        
    } else {
        bookItem.append(createDoneButton());
    };

    bookItem.append(createDeleteButton());

    return bookItem;
}

function addBookToCompleted(bookItem) {

    const bookTitle = bookItem.querySelector("h3").innerText;
    const bookInfo = bookItem.querySelector("p").innerText;

    const newBook = makeBook(bookTitle, bookInfo, true);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const book = findBook(bookItem[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;

    listCompleted.append(newBook);
    bookItem.remove();

    updateDataToStorage();
}

function addBookToIncompleted(bookItem) {

    const bookTitle = bookItem.querySelector("h3").innerText;
    const bookInfo = bookItem.querySelector("p").innerText;

    const newBook = makeBook(bookTitle, bookInfo, false);
    const listIncompleted = document.getElementById(INCOMPLETED_LIST_BOOK_ID);

    const book = findBook(bookItem[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    listIncompleted.append(newBook);
    bookItem.remove();

    updateDataToStorage();
}

function removeBook(bookItem) {

    while (bookItem.className != "book-item" ) {
        bookItem = bookItem.parentElement;
    }

    const bookPosition = findBookIndex(bookItem[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookItem.remove();
    updateDataToStorage();
}

function createButton(buttonInnerHTML, buttonTypeClass, eventlistener) {
    const button = document.createElement("button");
    button.innerHTML = buttonInnerHTML;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function(event) {
        eventlistener(event);
    });
    return button;
}

function createDoneButton() {
    return createButton("Selesai Dibaca", "done", function(event) {
        addBookToCompleted(event.target.parentElement);
    });
}

function createCancelButton() {
    return createButton("Belum Selesai Dibaca", "cancel", function(event) {
        addBookToIncompleted(event.target.parentElement);
    });
}

function createDeleteButton() {
    const featherTrash = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-trash-2\"><polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"></line><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"></line></svg>"
    return createButton(featherTrash, "delete", function(event) {
        showDeleteModal(event.target);
    });
}

function searchBook() {
    const inputSearchBook = document.getElementById("inputSearchBook").value;
    const bookList = document.getElementsByClassName("book-item");

    for (let book of bookList) {

        let result = book.innerText.search(inputSearchBook);

        if (result == -1) {
            book.style.display = "none";
        } else {
            book.style.display = "block";
        }
    }
}

function showDeleteModal(bookItem) {
    const deleteModal = document.getElementById("modalDelete");
    deleteModal.style.display = "block";

    document.getElementById("deleteYes").addEventListener("click", function() {
        removeBook(bookItem);
        deleteModal.style.display = "none";
    });

    document.getElementById("deleteNo").addEventListener("click", function() {
        deleteModal.style.display = "none";
    });
}