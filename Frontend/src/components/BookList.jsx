import { useEffect, useState } from 'react';
import { getAllBooks, deleteBook } from '../api/bookApi';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  'Available':   'badge green',
  'Checked Out': 'badge amber',
  'Reserved':    'badge blue',
  'Lost':        'badge red',
};

export default function BookList() {
  const [books, setBooks]     = useState([]);
  const [error, setError]     = useState(null);
  const [msg, setMsg]         = useState(null);
  const [deleting, setDelete] = useState(null);
  const navigate              = useNavigate();

  const fetchBooks = () =>
    getAllBooks()
      .then(res => setBooks(res.data))
      .catch(() => setError('Could not fetch books from server.'));

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDelete(id);
    try {
      await deleteBook(id);
      setMsg(`"${name}" was deleted.`);
      fetchBooks();
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setError('Delete failed. Please try again.');
    } finally {
      setDelete(null);
    }
  };

  return (
    <div>
      <div className="list-header">
        <div>
          <h2>Book List</h2>
          <p className="subtitle">{books.length} book{books.length !== 1 ? 's' : ''} in library</p>
        </div>
        <button className="btn primary" onClick={() => navigate('/add')}>+ Add Book</button>
      </div>

      {msg   && <div className="alert success">✓ {msg}</div>}
      {error && <div className="alert error">✕ {error}</div>}

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <p>No books yet. Add your first book!</p>
          <button className="btn primary" onClick={() => navigate('/add')}>+ Add Book</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>             
         {books.map((b, index) => (
           <tr key={b.id}>
           <td className="id-cell">{index + 1}</td>
                  <td>{b.author}</td>
                  <td>
                    <span className={STATUS_COLORS[b.status] || 'badge gray'}>
                      {b.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn small edit" onClick={() => navigate(`/edit/${b.id}`)}>
                      Edit
                    </button>
                    <button
                      className="btn small danger"
                      onClick={() => handleDelete(b.id, b.name)}
                      disabled={deleting === b.id}
                    >
                      {deleting === b.id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}