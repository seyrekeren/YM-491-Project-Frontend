import React, { useState, useEffect } from 'react';

const VideoList = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        // localhost:5000/api/channel/listMobileAppVideos endpoint'ine GET isteği yapılır
        fetch('http://localhost:5000/api/channel/listMobileAppVideos')
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);

                // Eğer API yanıtı bir nesne içeriyorsa ve videos özelliği varsa
                if (data && data.videos) {
                    setVideos(data.videos);
                } else {
                    console.error('Invalid data format from API');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleVideoClick = (s3Url) => {

        window.open(`${s3Url}`, '_blank');

    };

    return (
        <div>
            <h2>Video List</h2>
            <ul>
                {videos.map(video => (
                    <li key={video.title}>
                        <a
                            href="#"
                            onClick={() => handleVideoClick(video.S3_url)}
                        >
                            {video.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VideoList;
