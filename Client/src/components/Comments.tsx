import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import Translate from "./Translate";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import GetLocationAndLogin from "./getLocation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  commentbody: string;
  usercommented: string;
  commentedon: string;
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
}
const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const handleLike = async (comment: any) => {
    if (!user) return;
    // console.log(comment._id);
    const res = await axiosInstance.post(`/comment/like/${comment._id}`, {
      userId: user?._id,
      commentId: comment._id,
    });
    if (res.data.liked) {
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                likes: c.likes + 1,
                dislikes: res.data.disliked ? c.dislikes - 1 : c.dislikes,
                isDisliked: false,
                isLiked: res.data.liked,
              }
            : c
        )
      );
      console.log("Liked", res.data);
    } else {
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                likes: c.likes - 1,
                isDisliked: false,
                isLiked: res.data.liked,
              }
            : c
        )
      );
      console.log("Liked", res.data);
    }
    loadComments();
  };
  const handleDisLike = async (comment: any) => {
    if (!user) return;
    // console.log(comment._id);
    const res = await axiosInstance.post(`/comment/dislike/${comment._id}`, {
      userId: user?._id,
      commentId: comment._id,
    });

    if (res.data.disliked) {
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                dislikes: c.dislikes + 1,
                likes: res.data.liked ? c.likes - 1 : c.likes,
                isLiked: false,
                isDisliked: res.data.disliked && true,
              }
            : c
        )
      );
      console.log("disliked User id: ", comment.dislikedUsers.objectId);
      console.log("disliked", res.data);
    } else {
      setComments((prev) =>
        prev.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                dislikes: c.dislikes - 1,
                isLiked: false,
                isDisliked: res.data.disliked && true,
              }
            : c
        )
      );
      console.log("disliked", res.data);
    }
    loadComments();
  };

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/comment/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading comments...</div>;
  }
  //   if (!user || !newComment.trim()) return;
  //   setIsSubmitting(true);
  //   try {
  //     const res = await axiosInstance.post("/comment/postcomment", {
  //       videoId: videoId,
  //       userid: user._id,
  //       commentbody: newComment,
  //       usercommented: user.name,
  //     });
  //     if (res.data.comment) {
  //       const newCommentObj: Comment = {
  //         _id: Date.now().toString(),
  //         videoid: videoId,
  //         userid: user._id,
  //         commentbody: newComment,
  //         usercommented: user.name || "Anonymous",
  //         commentedon: new Date().toISOString(),
  //         likes: 0,
  //         dislikes: 0,
  //         isLiked: false,
  //         isDisliked: false,
  //       };
  //       setComments([newCommentObj, ...comments]);
  //     }
  //     setNewComment("");
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // const isValidComment = (text: string) => {
  //   // \p{L} = any kind of letter from any language
  //   // \p{N} = numbers (0-9, also other numeral systems)
  //   // \s = whitespace
  //   // + means one or more characters
  //   return /^[\p{L}\p{N}\s]+$/u.test(text);
  // };
  const isValidComment = (text: string) => {
    // \p{L} = any letter in any language
    // \p{M} = marks (like accents, vowel signs in Hindi, etc.)
    // \p{N} = numbers
    // \s = spaces
    // + = one or more characters
    return /^[\p{L}\p{M}\p{N}\s]+$/u.test(text);
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    const trimmedComment = newComment.trim();
    if (!isValidComment(trimmedComment)) {
      toast(
        "Comments can contain only letters and numbers, no special characters."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoId: videoId,
        userid: user._id,
        commentbody: trimmedComment,
        usercommented: user.name,
      });

      if (res.data.comment) {
        const newCommentObj: Comment = {
          _id: Date.now().toString(),
          videoid: videoId,
          userid: user._id,
          commentbody: trimmedComment,
          usercommented: user.name || "Anonymous",
          commentedon: new Date().toISOString(),
          likes: 0,
          dislikes: 0,
          isLiked: false,
          isDisliked: false,
        };
        setComments([newCommentObj, ...comments]);
      }
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
    loadComments();
  };

  const handleEdit = (comment: Comment) => {
    // console.log(comment);
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) return;
    try {
      const res = await axiosInstance.post(
        `/comment/editcomment/${editingCommentId}`,
        { commentbody: editText }
      );
      if (res.data) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === editingCommentId ? { ...c, commentbody: editText } : c
          )
        );
        setEditingCommentId(null);
        setEditText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("delete clicked");
    try {
      const res = await axiosInstance.delete(`/comment/deletecomment/${id}`);
      if (res.data.comment) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
    loadComments();
  };

  const translateTextComment = async (targetLang: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/translate", {
        text: newComment,
        targetLang,
      });
      setNewComment(response.data.translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const arr = {
    Hindi: "hi",
    English: "en",
    Spanish: "es",
    French: "fr",
    German: "de",
    Japanese: "ja",
    Korean: "ko",
    Russian: "ru",
    Arabic: "ar",
    Portuguese: "pt",
    Italian: "it",
    Dutch: "nl",
    Turkish: "tr",
    Vietnamese: "vi",
    Bengali: "bn",
    Polish: "pl",
    Thai: "th",
    Swedish: "sv",
    Greek: "el",
    Hebrew: "he",
    Indonesian: "id",
    Malay: "ms",
    Tamil: "ta",
    Ukrainian: "uk",
    Gujarati: "gu",
    Marathi: "mr",
    Telugu: "te",
    Kannada: "kn",
    Hausa: "ha",
    Persian: "fa",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: any) => setNewComment(e.target.value)}
              className="min-h-[40px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex gap-2 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    disabled={loading}
                    className="buttons bg-blue-100 text-black"
                    variant="ghost"
                  >
                    {loading ? "Translating..." : "Choose Language"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.entries(arr).map(([languageName, langCode]) => (
                    <DropdownMenuItem key={langCode}>
                      <Button
                        type="button"
                        className="buttons"
                        variant="ghost"
                        onClick={() => {
                          translateTextComment(langCode);
                        }}
                      >
                        {languageName}
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                onClick={() => setNewComment("")}
                disabled={!newComment.trim()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmitComment();
                }}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage />
                <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.usercommented}
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatDistanceToNow(new Date(comment.commentedon))} ago
                  </span>
                  {user?.email && <GetLocationAndLogin email={user.email} />}
                  {/* {user?.email && (
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-gray-500">
                        location_on
                      </span>
                      <GetLocationAndLogin email={user.email} />
                    </div>
                  )} */}
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        className="buttons hover:text-black"
                        onClick={handleUpdateComment}
                        disabled={!editText.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        className="buttons hover:text-black"
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">{comment.commentbody}</p>
                    {comment.userid === user?._id && (
                      <div className="flex gap-2 mt-2 text-sm text-gray-500">
                        <Button
                          className="buttons bg-gray-100 hover:bg-gray-200 text-black"
                          onClick={() => handleEdit(comment)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="buttons bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(comment._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2 mt-2 text-sm text-gray-500">
                      <Translate
                        commentId={comment._id}
                        commentText={comment.commentbody}
                        onTranslated={(id, newText) => {
                          setComments((prev) =>
                            prev.map((c) =>
                              c._id === id ? { ...c, commentbody: newText } : c
                            )
                          );
                        }}
                      />
                      <div className="flex items-center bg-blue-100 rounded-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="buttons hover:bg-blue-200 rounded-l-full"
                          onClick={() => {
                            handleLike(comment);
                          }}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 mr-0 ${
                              comment.likes ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                          {comment?.likes || 0}
                        </Button>
                        <div className="w-px h-4 bg-gray-300" />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="buttons hover:bg-blue-200 rounded-r-full"
                          onClick={() => {
                            handleDisLike(comment);
                          }}
                        >
                          <ThumbsDown
                            className={`w-4 h-4 mr-0 ${
                              comment.dislikes ? "fill-gray-500" : ""
                            }`}
                          />
                          {comment?.dislikes || 0}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
