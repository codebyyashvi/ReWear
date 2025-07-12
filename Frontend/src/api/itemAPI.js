import axios from 'axios';

export const createItem = async (itemData, token) => {
  const response = await axios.post('http://127.0.0.1:5000/items', itemData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
