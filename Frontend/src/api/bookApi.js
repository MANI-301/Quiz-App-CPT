import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080' });

export const getAllBooks  = ()         => api.get('/books');
export const getBookById = (id)       => api.get(`/books/${id}`);
export const createBook  = (book)     => api.post('/books', book);
export const updateBook  = (id, book) => api.put(`/books/${id}`, book);
export const deleteBook  = (id)       => api.delete(`/books/${id}`);