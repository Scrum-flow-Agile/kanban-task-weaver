import React, { useState } from 'react';

function Login() {
  // STATE VARIABLES - PUT THESE INSIDE THE FUNCTION
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // FUNCTIONS - PUT THESE INSIDE THE FUNCTION
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your login logic here
  };

  // RETURN/RENDER SECTION - THIS IS WHAT SHOWS IN UI
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* PASSWORD FIELD WITH SHOW/HIDE */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        {/* FORGOT PASSWORD LINK */}
        <div className="forgot-password-link">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
        
        <button type="submit">Login</button>
      </form>
      <p>Need an account? Register</p>
    </div>
  );
}

export default Login;