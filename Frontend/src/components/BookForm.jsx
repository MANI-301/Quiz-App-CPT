import { useState, useEffect } from 'react';
import { createBook, updateBook, getBookById } from '../api/bookApi';
import { useNavigate, useParams } from 'react-router-dom';

const empty = { name: '', author: '', status: '' };
const STATUS_OPTIONS = ['Available', 'Checked Out', 'Reserved', 'Lost'];

export default function BookForm() {
  const [form, setForm]       = useState(empty);
  const [message, setMessage] = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const { id }                = useParams();
  const navigate              = useNavigate();
  const isEdit                = Boolean(id);

useEffect(() => {
    if (isEdit) {
        getBookById(id)
            .then(res => setForm(res.data))
            .catch(err => {
                console.error("Error loading book:", err.response?.status, err.message);
                if (err.response?.status === 404) {
                    setError(`Book with ID ${id} not found.`);
                } else {
                    setError('Failed to load book. Is the server running?');
                }
            });
    }
}, [id, isEdit]);


  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setMessage(null); setError(null);
    try {
      if (isEdit) {
        await updateBook(id, form);
        setMessage('Book updated successfully!');
      } else {
        await createBook(form);
        setMessage('Book added successfully!');
        setForm(empty);
      }
      setTimeout(() => navigate('/'), 1500);
    } catch {
      setError('Operation failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <span className="form-icon">{isEdit ? '✏️' : '📖'}</span>
        <h2>{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
      </div>

      {message && <div className="alert success">✓ {message}</div>}
      {error   && <div className="alert error">✕ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Book Name</label>
          <input
            id="name" name="name" type="text"
            value={form.name} onChange={handleChange}
            placeholder="e.g. The Pragmatic Programmer"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="author">Author</label>
          <input
            id="author" name="author" type="text"
            value={form.author} onChange={handleChange}
            placeholder="e.g. Andrew Hunt"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} required>
            <option value="">-- Select Status --</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Add Book'}
          </button>
          <button type="button" className="btn" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}