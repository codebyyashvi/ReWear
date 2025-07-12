import { useEffect, useState } from 'react';
import axios from '../axiosConfig';

const Admin = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('/items').then(res => setItems(res.data));
  }, []);

  const toggleStatus = (id, status) => {
    const updatedStatus = status === 'approved' ? 'rejected' : 'approved';
    axios.patch(`/items/${id}`, { status: updatedStatus }).then(() => {
      setItems(items.map(item =>
        item.id === id ? { ...item, status: updatedStatus } : item
      ));
    });
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {items.map(item => (
        <div key={item.id}>
          {item.title} - Status: {item.status}
          <button onClick={() => toggleStatus(item.id, item.status)}>
            Toggle
          </button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
