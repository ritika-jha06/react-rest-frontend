import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Home.css"; // Make sure you created this CSS file

const Home = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts", {
        headers: {
          Authorization: user.token,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async (postId) => {
    try {
      await api.put(
        `/posts/like/${postId}`,
        {},
        {
          headers: { Authorization: user.token },
        }
      );
      fetchPosts();
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await api.put(
        `/posts/unlike/${postId}`,
        {},
        {
          headers: { Authorization: user.token },
        }
      );
      fetchPosts();
    } catch (err) {
      console.error("Unlike error", err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;
    try {
      await api.post(
        `/posts/comment/${postId}`,
        { text: commentText[postId] },
        { headers: { Authorization: user.token } }
      );
      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (err) {
      console.error("Comment error", err);
    }
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/posts/delete/${postId}`, {
        headers: { Authorization: user.token },
      });
      fetchPosts();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error deleting post");
    }
  };

  return (
    <div className="home-container">
      <h2 className="feed-title">Your Feed</h2>
      {posts.length === 0 ? (
        <p className="no-posts">No posts yet. Be the first to upload!</p>
      ) : (
        posts.map((post) => {
          const isLiked = post.likes.includes(user.user.id);
          return (
            <div className="post-card" key={post._id}>
              <div className="post-header">
                <div className="avatar-circle">
                  {post.postedBy.username[0].toUpperCase()}
                </div>
                <span className="username">@{post.postedBy.username}</span>
              </div>

              <img className="post-image" src={post.imageUrl} alt="post" />

              <div className="post-content">
                <p className="caption">{post.caption}</p>
                <div className="post-actions">
                  {isLiked ? (
                    <button
                      className="unlike-btn"
                      onClick={() => handleUnlike(post._id)}
                    >
                      💔 Unlike
                    </button>
                  ) : (
                    <button
                      className="like-btn"
                      onClick={() => handleLike(post._id)}
                    >
                      ❤️ Like
                    </button>
                  )}
                  <span>{post.likes.length} likes</span>
                </div>

                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post._id]: e.target.value,
                      })
                    }
                  />
                  <button onClick={() => handleComment(post._id)}>💬</button>
                </div>

                <div className="comment-list">
                  {post.comments.map((c, index) => (
                    <p key={index} className="comment">
                      <strong>@{c.postedBy.username}</strong>: {c.text}
                    </p>
                  ))}
                </div>

                {post.postedBy._id === user.user.id && (
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="delete-btn"
                  >
                    🗑️ Delete Post
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home;
