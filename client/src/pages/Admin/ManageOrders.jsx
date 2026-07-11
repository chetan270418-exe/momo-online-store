import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import { getAdminOrders, updateOrderStatus, deleteOrder } from '../../services/api';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast.success('Order status updated');
      fetchOrders(); // Refresh to get updated data
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to completely delete this order?')) {
      try {
        await deleteOrder(id);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        toast.error('Failed to delete order');
      }
    }
  };

  if (loading) return <AdminLayout><div className="text-center">Loading orders...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex-between mb-4">
        <h1 style={{ fontFamily: 'var(--font-heading)' }}>Manage Orders</h1>
        <button className="btn btn-outline" onClick={fetchOrders}>Refresh</button>
      </div>
      
      <div className="card" style={{overflowX: 'auto'}}>
        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)'}}>
              <th style={{padding: '1rem'}}>Order ID</th>
              <th style={{padding: '1rem'}}>Customer</th>
              <th style={{padding: '1rem'}}>Date</th>
              <th style={{padding: '1rem'}}>Total</th>
              <th style={{padding: '1rem'}}>Status</th>
              <th style={{padding: '1rem'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4">No orders found.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} style={{borderBottom: '1px solid var(--border)'}}>
                  <td style={{padding: '1rem'}}>{order._id.substring(18)}</td>
                  <td style={{padding: '1rem'}}>
                    {order.user?.name}<br/>
                    <small className="text-secondary">{order.user?.email}</small>
                  </td>
                  <td style={{padding: '1rem'}}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{padding: '1rem'}}>₹{order.totalPrice}</td>
                  <td style={{padding: '1rem'}}>
                    <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{padding: '1rem'}}>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <select 
                        className="select" 
                        style={{minWidth: '150px'}}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button 
                        className="btn btn-sm btn-outline text-danger" 
                        style={{borderColor: '#DC2626', padding: '0.5rem'}}
                        onClick={() => handleDelete(order._id)}
                        title="Delete Order"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders;
