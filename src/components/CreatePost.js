// src/components/CreatePost.js
import React, { useState } from 'react';
import { useCreatePost } from '../hooks/usePosts';

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { createPost, loading, error } = useCreatePost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newPost = await createPost({ title, body });
      setTitle('');
      setBody('');
      onPostCreated?.(newPost);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post">
      <h2>Create New Post</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Body:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

export default CreatePost;