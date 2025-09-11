import React from "react";
import Videocard from "./videocard";

const ChannelVideo = ({ videos }: any) => {
  if (videos.length == 0) {
    return (
      <div>
        <p>No videos Uploaded yet!</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video: any) => (
          <Videocard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default ChannelVideo;
