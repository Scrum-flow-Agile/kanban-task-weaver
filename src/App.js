// src/App.js
import React, { useState } from 'react';
import PostsList from './components/PostsList';
import CreatePost from './components/CreatePost';
import APITest from './APITest'; // ADDED THIS IMPORT
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = () => {
    // Trigger refresh of posts list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My API Integration App</h1>
      </header>
      
      <main>
        {/* ADDED THIS LINE - API TEST COMPONENT */}
        <APITest />
        
        <CreatePost onPostCreated={handlePostCreated} />
        <PostsList key={refreshTrigger} />
      </main>
    </div>
  );
}

export default App;