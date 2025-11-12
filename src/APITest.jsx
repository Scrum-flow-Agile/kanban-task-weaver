// src/APITest.jsx
import React, { useState } from 'react';
import { apiService } from './services/apiService';

function APITest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await apiService.post('/auth/login', {
        e: email,  // Based on your API schema - it uses 'e' for email
        l: password // Based on your API schema - it uses 'l' for password
      });
      setResult({ success: true, data: response.data });
      console.log('✅ LOGIN SUCCESS:', response.data);
    } catch (error) {
      setResult({ success: false, error: error.message });
      console.error('❌ LOGIN FAILED:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '10px', border: '2px solid blue' }}>
      <h2>🚀 SCRUM API LOGIN TEST</h2>
      <p><strong>Testing:</strong> POST /auth/login</p>
      
      <div style={{ marginBottom: '10px' }}>
        <div>
          <label>Email: </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            placeholder="Enter email"
          />
        </div>
        <div style={{ marginTop: '5px' }}>
          <label>Password: </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            placeholder="Enter password"
          />
        </div>
      </div>
      
      <button 
        onClick={testLogin} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          background: loading ? 'gray' : '#007bff', 
          color: 'white', 
          border: 'none',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {loading ? '🔄 Testing Login...' : '🚀 TEST LOGIN API'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          background: result.success ? '#d4edda' : '#f8d7da',
          border: `2px solid ${result.success ? '#28a745' : '#dc3545'}`,
          borderRadius: '5px'
        }}>
          <h3 style={{ color: result.success ? '#155724' : '#721c24', margin: '0 0 10px 0' }}>
            {result.success ? '✅ LOGIN SUCCESSFUL!' : '❌ LOGIN FAILED'}
          </h3>
          <pre style={{ 
            background: 'white', 
            padding: '10px', 
            borderRadius: '3px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default APITest;