class Book {
  constructor(author, year, title, city, publisher) {
    this.author = author;
    this.year   = year;
    this.title  = title;
    this.city   = city;
    this.publisher   = publisher;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element
    const row = document.createElement('tr');
    // Inserting cols
    row.innerHTML =`
      <td>${book.author}</td>
      <td>${book.year}</td>
      <td>${book.title}</td>
      <td>${book.city}</td>
      <td>${book.publisher}</td>
      <td style="text-decoration:none;"><a href="#" class="delete">Hapus <i class="fas fa-trash"></i></i></a></td>
      `;
    list.appendChild(row);

    const ref = document.getElementById('reference');
    const refRow = document.createElement('tr');
    refRow.innerHTML = `<td class='delete'>${book.author}. ${book.year}. ${book.title}. ${book.city}: ${book.publisher}</td>`;

    ref.appendChild(refRow);
  }

  showAlert(message, className) {
    // Create div 
    const div = document.createElement('div');
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container'),
    // Get line
          line      = document.querySelector('.line');
    // Insert Alert
    container.insertBefore(div, line);
    // Set timeout after 2 sec
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 2000);
  }  

  deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
    // Reload after deleting
    setTimeout(function(){
      window.location.reload();
    }, 2000);
  }

  clearFields() {
    document.getElementById('author').value = '';
    document.getElementById('year').value = '';
    document.getElementById('title').value = '';
    document.getElementById('city').value = '';
    document.getElementById('publisher').value = '';
  }
}

// Local storage class
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books' === null)) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    
    books.forEach(function(book) { 
      const ui = new UI;
      // Add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(publisher) {
    const books = Store.getBooks();
    
    books.forEach(function(book, index) { 
      if(book.publisher === publisher) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
  // Get form-value
  const author    = document.getElementById('author').value,
        year      = document.getElementById('year').value,
        title     = document.getElementById('title').value,
        city      = document.getElementById('city').value,
        publisher = document.getElementById('publisher').value;

  // Instantiate book
  const book = new Book(author, year, title, city, publisher);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if(author === '' || year === '' || title === '' || city === '' || publisher === ''){
    // Error Alert
    ui.showAlert('Please complete the form before submitting', 'error');
    
  } else {
    // Add book to list
    ui.addBookToList(book);
    
    // Add to LS
    Store.addBook(book);
    
    // Show success
    ui.showAlert('Daftar pustaka telah berhasil ditambahkan', 'success');

    // Clear Fields
    ui.clearFields();
  }
  e.preventDefault();
});

// Event listener for delete ref
document.getElementById('book-list').addEventListener('click', function(e){
  // Instantiate UI
  const ui = new UI();

  // Delete ref
  ui.deleteBook(e.target);

  // Remove ref from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // Show Alert for deleting
  ui.showAlert('Daftar pustaka telah berhasil dihapus', 'warning');

  e.preventDefault();
});