// src/components/PostsList.js
import React from 'react';
import { usePosts } from '../hooks/usePosts';

const PostsList = () => {
  const { data: posts, loading, error } = usePosts();

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="posts-list">
      <h2>Posts</h2>
      {posts?.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default PostsList;