import React, { useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/CreatePost.css"; // Make sure this CSS file exists

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await api.get("/posts", {
        headers: { Authorization: user.token },
      });
      const mine = res.data.filter((p) => p.postedBy._id === user.user.id);
      setMyPosts(mine);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption || !image) return alert("Please fill all fields");

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      await api.post("/posts/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: user.token,
        },
      });
      alert("Post uploaded!");
      setCaption("");
      setImage(null);
      setPreview(null);
      fetchMyPosts();
    } catch (error) {
      alert("Failed to upload post");
      console.error(error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: user.token },
      });
      alert("Post deleted");
      fetchMyPosts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="create-post-container">
      <h2 className="title">Create New Post</h2>
      <form className="post-form" onSubmit={handleSubmit} encType="multipart/form-data">
        {preview && <img className="preview-image" src={preview} alt="preview" />}
        <input
          className="caption-input"
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button className="submit-btn" type="submit">📤 Post</button>
      </form>

      <h3 className="sub-title">My Posts</h3>
      <div className="my-posts">
        {myPosts.map((post) => (
          <div key={post._id} className="my-post-card">
            <img src={post.imageUrl} alt="post" />
            <p>{post.caption}</p>
            <button
              className="delete-btn"
              onClick={() => handleDelete(post._id)}
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePost;
