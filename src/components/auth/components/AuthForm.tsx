import { useState } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',  
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const {
    login,
    register,
    error,
    loading,
    clearError
  } = useAuthStore();

  const navigate = useNavigate();

  // Define allowed special characters
  const allowedSpecialChars = "!@#$%^&*";

  const validatePasswordCharacters = (password: string): string => {
    // Check for invalid characters (anything not allowed)
    const invalidChars = password.match(/[^a-zA-Z0-9!@#$%^&*]/g);
    
    if (invalidChars) {
      const uniqueInvalidChars = [...new Set(invalidChars)];
      return `Invalid characters: ${uniqueInvalidChars.join(', ')}. Only letters, numbers, and ${allowedSpecialChars} are allowed.`;
    }
    
    return '';
  };

  const validatePasswordRequirements = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: new RegExp(`[${allowedSpecialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)
    };

    const errors = [];
    if (!requirements.length) errors.push("at least 8 characters");
    if (!requirements.uppercase) errors.push("one uppercase letter");
    if (!requirements.number) errors.push("one number");
    if (!requirements.special) errors.push(`one special character (${allowedSpecialChars})`);

    return { requirements, errors };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    
    // Clear previous errors
    clearError();
    setPasswordError('');
    
    // Check for invalid characters first
    const characterError = validatePasswordCharacters(newPassword);
    if (characterError) {
      setPasswordError(characterError);
    }
    
    setFormData({ ...formData, password: newPassword });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError(); // Reset previous errors

    try {
      // Frontend validation
      if (!isLogin) {
        // Check for invalid characters first
        const characterError = validatePasswordCharacters(formData.password);
        if (characterError) {
          throw new Error(characterError);
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const { errors } = validatePasswordRequirements(formData.password);
        if (errors.length > 0) {
          throw new Error(`Password requires: ${errors.join(', ')}`);
        }
      }

      if (isLogin) {
       await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await register(formData.name, formData.email, formData.password);
        alert('Registration successful! Please check your email.');
        setIsLogin(true); // Switch to login after registration
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { requirements } = validatePasswordRequirements(formData.password);

  return (
    <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-white shadow">
      <h2 className="text-2xl font-bold text-center">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      
      {error && (
        <div className="p-2 text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              className={`w-full p-2 border rounded pr-10 ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          
          {/* INVALID CHARACTERS ERROR MESSAGE */}
          {passwordError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <p className="text-xs text-red-600 font-medium">{passwordError}</p>
              <p className="text-xs text-gray-600 mt-1">
                Allowed special characters: <strong>{allowedSpecialChars.split('').join(' ')}</strong>
              </p>
            </div>
          )}
          
          {/* REAL-TIME PASSWORD STRENGTH MESSAGES */}
          {!isLogin && formData.password && !passwordError && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium text-gray-700">Password must contain:</p>
              <div className="space-y-1">
                <div className={`text-xs flex items-center ${requirements.length ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                  At least 8 characters
                </div>
                <div className={`text-xs flex items-center ${requirements.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                  One uppercase letter (A-Z)
                </div>
                <div className={`text-xs flex items-center ${requirements.number ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                  One number (0-9)
                </div>
                <div className={`text-xs flex items-center ${requirements.special ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                  One special character ({allowedSpecialChars})
                </div>
              </div>
            </div>
          )}
          
          {/* Show simple message for login */}
          {isLogin && formData.password && !passwordError && (
            <div className="mt-1">
              <div className={`text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                {formData.password.length >= 8 ? '✓ Password looks good' : 'Enter your password'}
              </div>
            </div>
          )}
        </div>

        {isLogin && (
          <div className="text-right">
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        )}

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full p-2 border rounded pr-10"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            {/* Password match indicator */}
            {formData.confirmPassword && (
              <div className="mt-1">
                <div className={`text-xs ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!isLogin && !!passwordError)}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button
        onClick={() => {
          setIsLogin(!isLogin);
          clearError();
          setPasswordError('');
        }}
        className="w-full text-center text-blue-600 hover:underline"
      >
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
}