import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Clock,
  Download,
  MoreHorizontal,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

const VideoInfo = ({ video }: any) => {
  const [likes, setLikes] = useState(video.Likes || 0);
  const [dislikes, setDisLikes] = useState(video.Dislikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisLiked, setIsDisLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const { user } = useUser();
  const [viewCounted, setViewCounted] = useState(false);

  useEffect(() => {
    setLikes(video.Likes || 0);
    setDisLikes(video.Dislikes || 0);
    setIsLiked(false);
    setIsDisLiked(false);
  }, [video]);

  useEffect(() => {
    if (viewCounted) return;
    console.log("view Incremented");

    const handleViews = async () => {
      if (user) {
        try {
          await axiosInstance.post(`/history/${video._id}`, {
            userId: user._id,
          });
          setViewCounted(true);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await axiosInstance.post(`/history/views/${video?._id}`);
          setViewCounted(true);
        } catch (error) {
          console.log(error);
        }
      }
    };
    handleViews();
  }, [user, video._id, viewCounted]);

  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user?._id,
      });
      console.log(res.data)
      if (res.data.liked) {
        if (isLiked) {
          setLikes((prev: any) => prev - 1);
          setIsLiked(false);
        } else {
          setLikes((prev: any) => prev + 1);
          setIsLiked(true);
          if (isDisLiked) {
            setDisLikes((prev: any) => prev - 1);
            setIsDisLiked(false);
          }
        }
      }
      console.log(res.data)
    } catch (error) {
      console.log(error);
    }
  };
  const handleDisLike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/like/${video._id}`, {
        userId: user?._id,
      });
      console.log(res.data)
      if (!res.data.liked) {
        if (isDisLiked) {
          setDisLikes((prev: any) => prev - 1);
          setIsDisLiked(false);
        } else {
          setDisLikes((prev: any) => prev + 1);
          setIsDisLiked(true);
          if (isLiked) {
            setLikes((prev: any) => prev - 1);
            setIsLiked(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleWatchLater = async () => {
    try {
      const res = await axiosInstance.post(`/watch/${video._id}`, {
        userId: user?._id,
      });
      if (res.data.watchlater) {
        setIsWatchLater(!isWatchLater);
      } else {
        setIsWatchLater(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{video?.videotitle}</h1>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center justify-between gap-4">
          <Avatar className="cursor-default w-10 h-10">
            <AvatarFallback>{video?.videochannel[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{video?.videochannel}</h3>
            <p className="text-sm text-gray-600">1.2M subscribers</p>
          </div>
          <Button className="buttons ml-4 bg-red-500 hover:bg-red-600">Subscribe</Button>
        </div>
        <div className="flex flex-wrap items-center xl:gap-6 gap-2">
          <div className="flex items-center bg-gray-100 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              className="buttons rounded-l-full"
              onClick={handleLike}
            >
              <ThumbsUp
                className={`w-4 h-4 mr-0 ${
                  isLiked ? "fill-black text-black" : ""
                }`}
              />
              {likes.toLocaleString()}
            </Button>
            <div className="w-px h-4 bg-gray-300" />
            <Button
              variant="ghost"
              size="sm"
              className="buttons rounded-r-full"
              onClick={handleDisLike}
            >
              <ThumbsDown
                className={`w-4 h-4 mr-0 ${
                  isDisLiked ? "fill-black text-black" : ""
                }`}
              />
              {dislikes.toLocaleString()}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`buttons bg-gray-100 rounded-full ${
              isWatchLater ? "text-primary" : ""
            }`}
            onClick={handleWatchLater}
          >
            <Clock className="w-5 h-5 mr-2" />
            {isWatchLater ? "Saved" : "Watch Later"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="buttons bg-gray-100 rounded-full"
          >
            <Share className="w-4 h-4 mr-0" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="buttons bg-gray-100 rounded-full"
          >
            <Download className="w-5 h-5 mr-0" />
            Download
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="buttons bg-gray-100 rounded-full"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Button className="buttons">More Options</Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex gap-4 text-sm font-medium mb-2">
          <span>{video.views.toLocaleString()} views</span>
          <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
        </div>
        <div className={`text-sm ${showFullDescription ? "" : "line-clamp-3"}`}>
          <p>
            Sample video description. This would contain the actual video
            description from the database.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 p-0 h-auto font-medium"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show less" : "Show more"}
        </Button>
      </div>
    </div>
  );
};

export default VideoInfo;
