import { useState } from 'react';
import { Button, Input, Typography, Select } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.userType : null;
};

const AdminLayout = () => {
  const [trainingArea, setTrainingArea] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const userRole = getUserRole();

  const handleTrainerNameChange = (value) => {
    setTitle(value);
  };

  const handleTrainingAreaChange = (value) => {
    switch (value) {
      case 'game':
        setTrainingArea('65b56feb202e290a12b78c81');
        break;
      case 'web':
        setTrainingArea('65b56f76531f1059e8b05fec');
        break;
      case 'data':
        setTrainingArea('65b57000202e290a12b78c84');
        break;
      case 'mobile':
        setTrainingArea('65b57014202e290a12b78c87');
        break;
      default:
        setTrainingArea(null);
        break;
    }
  };

  const handleTrainingDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('No File Selected');
      return;
    }

    const fd = new FormData();
    fd.append('uploaded', file);

    try {
      const response = await axios.post('http://httpbin.org/post', fd, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      console.log(response.data);
      setUploadProgress(0); // Yükleme tamamlandığında progress'i sıfırla
      return file;
    } catch (err) {
      console.error(err);
      setUploadProgress(0); // Hata durumunda progress'i sıfırla
    }

    return fd;
  };

  const handleUploadClick = async () => {
    try {
      const formData = new FormData();

      formData.append('title', title);
      formData.append('description', description);
      formData.append('channelId', trainingArea);

      const token = localStorage.getItem('token');

      const uploadedFileResponse = await handleUpload();
      formData.append('file', uploadedFileResponse);

      const response = await axios.post(`http://localhost:5000/api/channel/upload-video`, formData, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
        },
        credentials: 'include',
      });

      console.log(response);

      if (response.status === 201) {
        console.log('Video başarıyla yüklendi.');
      }
    } catch (error) {
      console.error('Video yüklenirken bir hata oluştu:', error);
    }
  };

  if (userRole === 'admin') {
    return (
        <div>
          <Title level={2}>Eğitim Yükle</Title>
          <div>
            <Text>Title:</Text>
            <Input value={title} onChange={(e) => handleTrainerNameChange(e.target.value)} />
          </div>
          <div>
            <Text>Eğitim Açıklaması:</Text>
            <Input.TextArea rows={4} value={description} onChange={handleTrainingDescriptionChange} />
          </div>
          <div>
            <Text>Yüklenmek İstenen Eğitim Alanı:</Text>
            <Select style={{ width: 200 }} value={trainingArea} onChange={handleTrainingAreaChange}>
              <Option value="web">Web Geliştirme</Option>
              <Option value="mobile">Mobil Uygulama Geliştirme</Option>
              <Option value="data">Veri Bilimi</Option>
              <Option value="game">Oyun Geliştirme</Option>
            </Select>
          </div>

          <div>
            <input onChange={(e) => setFile(e.target.files[0])} type="file" />
          </div>

          {/* İlerleme durumunu gösteren bileşen */}
          <div style={{ marginTop: '10px' }}>
            <progress value={uploadProgress} max="100" />
            <span>{uploadProgress}%</span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Button type="primary" onClick={handleUploadClick}>
              Eğitimi Yükle
            </Button>
          </div>
        </div>
    );
  } else {
    return null;
  }
};

AdminLayout.propTypes = {
  children: PropTypes.node,
};

export default AdminLayout;
