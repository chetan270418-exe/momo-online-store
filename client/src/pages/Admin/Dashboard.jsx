import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import { getStats } from '../../services/api';
import { FiDollarSign, FiShoppingBag, FiBox, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data.stats);
      } catch (error) {
        toast.error('Failed to load stats');
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <AdminLayout><div className="text-center">Loading dashboard...</div></AdminLayout>;
  if (!stats) return <AdminLayout><div className="text-center">Error loading stats.</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Dashboard</h1>
      
      <div className="grid grid-2 grid-4 mb-4">
        <div className="card p-4 flex-between">
          <div>
            <p className="text-secondary mb-2">Total Revenue</p>
            <h3>₹{stats.totalRevenue || 0}</h3>
          </div>
          <div className="icon-wrapper" style={{background: '#E0F2FE', color: '#0284C7'}}>
            <FiDollarSign />
          </div>
        </div>
        
        <div className="card p-4 flex-between">
          <div>
            <p className="text-secondary mb-2">Total Orders</p>
            <h3>{stats.totalOrders}</h3>
          </div>
          <div className="icon-wrapper" style={{background: '#FEF3C7', color: '#D97706'}}>
            <FiShoppingBag />
          </div>
        </div>
        
        <div className="card p-4 flex-between">
          <div>
            <p className="text-secondary mb-2">Total Products</p>
            <h3>{stats.totalProducts}</h3>
          </div>
          <div className="icon-wrapper" style={{background: '#DCFCE7', color: '#16A34A'}}>
            <FiBox />
          </div>
        </div>
        
        <div className="card p-4 flex-between">
          <div>
            <p className="text-secondary mb-2">Total Users</p>
            <h3>{stats.totalUsers}</h3>
          </div>
          <div className="icon-wrapper" style={{background: '#F3E8FF', color: '#9333EA'}}>
            <FiUsers />
          </div>
        </div>
      </div>
      
      <div className="grid grid-2">
        <div className="card p-4">
          <h3 className="mb-4">Recent Orders</h3>
          {stats.recentOrders.length === 0 ? <p>No recent orders.</p> : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{borderBottom: '1px solid var(--border)'}}>
                    <th style={{padding: '0.5rem'}}>ID</th>
                    <th style={{padding: '0.5rem'}}>Customer</th>
                    <th style={{padding: '0.5rem'}}>Total</th>
                    <th style={{padding: '0.5rem'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id} style={{borderBottom: '1px solid var(--border)'}}>
                      <td style={{padding: '0.5rem'}}>{order._id.substring(18)}</td>
                      <td style={{padding: '0.5rem'}}>{order.user?.name || 'Unknown'}</td>
                      <td style={{padding: '0.5rem'}}>₹{order.totalPrice}</td>
                      <td style={{padding: '0.5rem'}}>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
