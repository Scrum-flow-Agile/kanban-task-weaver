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

  const {
    login,
    register,
    error,
    loading,
    clearError
  } = useAuthStore();

  const navigate = useNavigate();

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("one uppercase letter");
    if (!/\d/.test(password)) errors.push("one number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("one special character");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError(); // Reset previous errors


    try {
      // Frontend validation
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const pwdErrors = validatePassword(formData.password);
        if (pwdErrors.length > 0) {
          throw new Error(`Password requires: ${pwdErrors.join(', ')}`);
        }
      }

      if (isLogin) {
       await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await register(formData.name, formData.email, formData.password);
        alert('Registration successful! Please check your email.'); // refactor to use a toast popup
        setIsLogin(true); // Switch to login after registration
      }
    } catch (err) {
      // Error is already set in the store by login()/register()
      console.log(err);
      //handle errors : toast messages
      
    }
  };

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
          <input
            type="password"
            required
            minLength={8}
            className="w-full p-2 border rounded"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {!isLogin && (
            <p className="text-xs text-gray-500 mt-1">
              Requires: 8+ chars, 1 uppercase, 1 number, 1 special character (!@#$%^&*)
            </p>
          )}
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded"
              value={formData.confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
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
          clearError(); // Clear errors when switching modes
        }}
        className="w-full text-center text-blue-600 hover:underline"
      >
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
}
