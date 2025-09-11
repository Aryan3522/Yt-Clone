import React, { useEffect, useState } from "react";
import { getAllVideos } from "@/utils/db";

const DownloadsPage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [videoUrls, setVideoUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getAllVideos().then((videos) => {
      setVideos(videos);
      // Create object URLs once
      const urls: { [key: string]: string } = {};
      videos.forEach((video:any) => {
        urls[video.id] = URL.createObjectURL(video.blob);
      });
      setVideoUrls(urls);
    });
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(videoUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [videoUrls]);

  return (
    <div className="md:pl-60 pl-4">
      <h2>Downloads</h2>
      {videos.length === 0 && <p>No videos downloaded yet.</p>}
      {videos.map((video) => (
        <div key={video.id}>
          {/* <h3>{video.title}</h3> */}
          <video src={videoUrls[video.id]} controls />
        </div>
      ))}
    </div>
  );
};

export default DownloadsPage;
