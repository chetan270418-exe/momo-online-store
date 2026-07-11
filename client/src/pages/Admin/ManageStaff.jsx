import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import { getStaff, createStaff, deleteStaff } from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiPlus, FiX, FiUser } from 'react-icons/fi';

const ManageStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff(page, search);
  }, [page, search]);

  const fetchStaff = async (pageNum = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const data = await getStaff(pageNum, searchQuery);
      setStaff(data.users);
      setPages(data.pages || 1);
    } catch (error) {
      toast.error('Failed to load staff');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this staff member?')) {
      try {
        await deleteStaff(id);
        toast.success('Staff member removed');
        fetchStaff(page, search);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to remove staff');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createStaff(formData);
      toast.success(`Staff account created for ${formData.name}!`);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', phone: '' });
      fetchStaff(page, search);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create staff');
    }
    setSubmitting(false);
  };

  const roleColor = (role) => role === 'admin' ? '#D97706' : '#0D9488';
  const roleBg = (role) => role === 'admin' ? '#FEF3C7' : '#CCFBF1';

  return (
    <AdminLayout>
      <div className="flex-between mb-4">
        <h1 style={{ fontFamily: 'var(--font-heading)' }}>Manage Staff</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input"
              placeholder="Search name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-outline">Search</button>
          </form>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FiPlus /> Add Staff
          </button>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div className="text-center" style={{ padding: '3rem' }}>Loading staff...</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                <th style={{ padding: '1rem' }}>Staff Member</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Joined</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr><td colSpan="6" className="text-center" style={{ padding: '3rem' }}>No staff members yet. Click "Add Staff" to create one.</td></tr>
              ) : staff.map(member => (
                <tr key={member._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      <FiUser />
                    </div>
                    <span style={{ fontWeight: '600' }}>{member.name}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <a href={`mailto:${member.email}`} style={{ color: 'var(--text-secondary)' }}>{member.email}</a>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{member.phone || '—'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', background: roleBg(member.role), color: roleColor(member.role) }}>
                      {member.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      className="btn btn-sm btn-outline"
                      style={{ borderColor: '#DC2626', color: '#DC2626' }}
                      onClick={() => handleDelete(member._id)}
                      disabled={member.role === 'admin'}
                      title={member.role === 'admin' ? 'Cannot remove admin' : 'Remove Staff'}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>Page {page} of {pages}</span>
            <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Next</button>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <div className="flex-between mb-4">
              <h2>Add New Staff Member</h2>
              <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <p className="text-secondary mb-4" style={{ fontSize: '0.875rem' }}>This staff member will have access to the <strong>Kitchen Panel</strong> only — they can view and update active orders.</p>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="input" placeholder="e.g. Raju Tamang" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="input" placeholder="staff@momocafe.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input type="text" className="input" placeholder="+977 98XXXXXXXX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="input" placeholder="Set a strong password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create Staff Account'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageStaff;
