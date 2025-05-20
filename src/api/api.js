import axios from 'axios';

export const uploadImage = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  await axios.post('http://localhost:5000/upload', formData, config);
};
