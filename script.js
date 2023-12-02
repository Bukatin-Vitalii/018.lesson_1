const layout = document.querySelector('.layout');
const container = document.querySelector('.books');
const content = document.querySelector('.content');
let currentItems = [];
let pageNumber = 0;

function showContent() {
	content.classList.add('content__visible');
}

function searchBooks() {
	const searchInput = document.getElementById('searchInput').value;
	if (searchInput === '') {
		showError('Please enter something :)');
		return;
	}
	const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchInput}&startIndex=${pageNumber}&maxResults=6`;

	fetch(apiUrl)
		.then(response => response.json())
		.then(data => {
			if (data.totalItems === 0) {
				showError('No results found');
				return;
			}
			showContent();
			displayBooks(data.items);
			currentItems = data.items;
		})
		.catch(error => {
			console.error(error);
			showError(error);
		});
}

function showError(message) {
	const error = document.createElement('div');
	error.classList.add('error');
	error.textContent = message;
	layout.appendChild(error);

	setTimeout(() => {
		error.classList.add('error__show');
		setTimeout(() => {
			error.classList.add('error__hide');
			setTimeout(() => {
				error.remove();
			}, 500);
		}, 3000);
	}, 100);
}

function nextPage() {
	pageNumber += 6;
	searchBooks();
	scrollToTop();
}

function prevPage() {
	if (pageNumber > 0) {
		pageNumber -= 6;
		searchBooks();
		scrollToTop();
	}
}

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

function clearBooks() {
	container.innerHTML = '';
}

function displayBooks(books) {
	clearBooks();

	books.forEach(book => {
		const { title, volumeInfo } = book;
		const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
		const thumbnail = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : '';

		const bookCard = createBookCard(title, author, thumbnail);
		container.appendChild(bookCard);
	});
}

function createBookCard(title, author, thumbnail) {
	const bookCard = document.createElement('div');
	bookCard.classList.add('book');

	const image = document.createElement('img');
	image.classList.add('book__image');
	image.src = thumbnail;
	image.alt = title;

	const titleElement = document.createElement('h2');
	titleElement.classList.add('book__title');
	titleElement.textContent = title;

	const authorElement = document.createElement('p');
	authorElement.classList.add('book__author');
	authorElement.textContent = `Author: ${author}`;

	bookCard.appendChild(image);
	bookCard.appendChild(titleElement);
	bookCard.appendChild(authorElement);

	return bookCard;
}
