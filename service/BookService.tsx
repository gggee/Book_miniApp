const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = '';

export default class BookService {
    static async fetchBooks(query, maxResults = 40) {
        try {
            const response = await fetch(`${BASE_URL}?q=${query}&maxResults=${maxResults}&key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    }

    static async fetchBookDetails(id) {
        try {
            const response = await fetch(`${BASE_URL}/${id}?key=${API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching book details:', error);
            throw error;
        }
    }

    static async fetchBookContent(id) {
        return 'Book content';
    }
}
