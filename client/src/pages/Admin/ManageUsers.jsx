import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import { getAllUsers, deleteUser } from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  const fetchUsers = async (pageNumber = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const data = await getAllUsers(pageNumber, searchQuery);
      setUsers(data.users);
      setPages(data.pages || 1);
      setPage(data.page || 1);
    } catch (error) {
      toast.error('Failed to load users');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers(page, search);
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) return <AdminLayout><div className="text-center">Loading users...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex-between mb-4">
        <h1 style={{ fontFamily: 'var(--font-heading)' }}>Manage Users</h1>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Search name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>
      
      <div className="card" style={{overflowX: 'auto'}}>
        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)'}}>
              <th style={{padding: '1rem'}}>ID</th>
              <th style={{padding: '1rem'}}>Name</th>
              <th style={{padding: '1rem'}}>Email</th>
              <th style={{padding: '1rem'}}>Role</th>
              <th style={{padding: '1rem'}}>Joined Date</th>
              <th style={{padding: '1rem'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4">No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user._id} style={{borderBottom: '1px solid var(--border)'}}>
                  <td style={{padding: '1rem'}}>{user._id.substring(18)}</td>
                  <td style={{padding: '1rem', fontWeight: '500'}}>{user.name}</td>
                  <td style={{padding: '1rem'}}><a href={`mailto:${user.email}`} className="text-secondary">{user.email}</a></td>
                  <td style={{padding: '1rem'}}>
                    <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{padding: '1rem'}}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{padding: '1rem'}}>
                    <button 
                      className="btn btn-sm btn-outline text-danger" 
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === 'admin'}
                      title={user.role === 'admin' ? "Cannot delete admin" : "Delete User"}
                      style={{borderColor: '#DC2626'}}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
              Page {page} of {pages}
            </span>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setPage(p => Math.min(pages, p + 1))} 
              disabled={page === pages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
