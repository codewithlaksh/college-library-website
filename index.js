console.log("Welcome to Harry Library!");

// Books constructor
function Book(name, author, type) {
    this.name = name;
    this.author = author;
    this.type = type;
}

// Display contructor
function Display() { }

// Add methods to display prototype
Display.prototype.showAlert = function (type, message) {
    let messageDiv = document.getElementById("message");
    messageDiv.innerHTML = `<div class="alert alert-${type === "error" ? "danger" : "success"}" role="alert">
        <strong>${type === "error" ? "Error" : "Success"}: </strong> ${message}
    </div>`;
    setTimeout(() => {
        messageDiv.innerHTML = "";
    }, 3000);
}

Display.prototype.validate = function (book) {
    if (book.name.length < 5 || book.author.length < 5 || book.type == null) {
        return false;
    } else {
        return true;
    }
}

Display.prototype.add = function (book) {
    let harryLib = localStorage.getItem('harryLib');
    let books = [];
    if (harryLib != null) {
        books = JSON.parse(localStorage.getItem('harryLib'));
        books.push({
            name: book.name,
            author: book.author,
            type: book.type,
            id: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
        });
        localStorage.setItem('harryLib', JSON.stringify(books));
        this.getBooks();
    } else {
        books = [];
        books.push({
            name: book.name,
            author: book.author,
            type: book.type,
            id: Math.floor(Math.random() * (10000 - 1000 + 1) + 1000)
        });
        localStorage.setItem('harryLib', JSON.stringify(books));
        this.getBooks();
    }
}

Display.prototype.clear = function () {
    let libraryForm = document.getElementById("libraryForm");
    libraryForm.reset();
}

function deleteBook(bookId) {
    if (window.confirm("Are you sure, you want to delete this book ?")) {
        let display = new Display();
        display.deleteBook(bookId);
    }
}

Display.prototype.getBooks = function () {
    let harryLib = localStorage.getItem('harryLib');
    let books = [];
    if (harryLib != null) {
        books = JSON.parse(localStorage.getItem('harryLib'));
        let uiStr = "";
        Array.from(books).forEach(item => {
            uiStr += `<tr>
            <td>${item.name}</td>
            <td>${item.author}</td>
            <td>${String(item.type).charAt(0).toUpperCase() + String(item.type).slice(1)}</td>
            <td><button class="btn btn-sm btn-danger" id="${item.id}" onclick="deleteBook(this.id)">Delete Book</button></td>
            </tr>`;
        });
        let tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = uiStr;
    }
}

Display.prototype.deleteBook = function (bookId) {
    let harryLib = localStorage.getItem('harryLib');
    let books = [];
    if (harryLib != null) {
        books = JSON.parse(localStorage.getItem('harryLib'));
        let bookIndex = books.findIndex(book => {
            return book.id === bookId;
        });
        books.splice(bookIndex, 1);
        localStorage.setItem('harryLib', JSON.stringify(books));
        this.getBooks();
        this.showAlert("success", "Your book has been deleted successfully!");
    }
}

let display = new Display();
display.getBooks();

// Add submit event listener to form
let libraryForm = document.getElementById("libraryForm");
libraryForm.addEventListener('submit', libraryFormSubmit);

function libraryFormSubmit(e) {
    e.preventDefault();
    let name = document.getElementById("bookName").value;
    let author = document.getElementById("bookAuthor").value;
    let type = document.querySelector("input[type=radio][name=bookType]:checked") != null ? document.querySelector("input[type=radio][name=bookType]:checked").value : null;
    let book = new Book(name, author, type);

    let display = new Display();

    if (display.validate(book)) {
        display.add(book);
        display.clear();
        display.showAlert("success", "Your book has been added successfully!");
    } else {
        display.showAlert("error", "Cannot add this book!");
    }

}
