{/* REPLACE your existing password input with this: */}
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
{/* ADD this line after password field */}
<div className="forgot-password-link">
  <a href="/forgot-password">Forgot Password?</a>
</div>