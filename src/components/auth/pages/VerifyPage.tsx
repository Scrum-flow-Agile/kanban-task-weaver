import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/auth.store';
import { User } from '../stores/auth.store.ts';

interface Status {
  loading: boolean;
  message: string;
  error: string;
}

interface VerifyResponse {
  message: string;
  access_token: string;
  user?: User; 
}

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>({
    loading: true,
    message: 'Verifying your email...',
    error: ''
  });
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token) {
      setStatus({
        loading: false,
        message: '',
        error: 'Invalid verification link'
      });
      return;
    }

    const verifyEmail = async () => {
      try {
        const { data } = await axios.get<VerifyResponse>(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/verify?token=${token}`
        );

        if (email && data.user) {
          setUser(data.user);
          localStorage.setItem('token', data.access_token);
        }

        setStatus({
          loading: false,
          message: data.message || 'Email verified successfully!',
          error: ''
        });

        setTimeout(() => navigate('/dashboard'), 3000);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const errorMessage =
          axiosError.response?.data?.message || axiosError.message;

        setStatus({
          loading: false,
          message: '',
          error: errorMessage.includes('expired')
            ? 'Verification link expired. Please request a new one.'
            : errorMessage || 'Verification failed'
        });
      }
    };

    verifyEmail();
  }, [navigate, searchParams, setUser]);

  return (
    <div className="w-full max-w-md p-8 space-y-4 rounded-lg bg-white shadow text-center">
      {status.loading ? (
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mb-4"
            viewBox="0 0 24 24"
          >
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
          <p>Verifying...</p>
        </div>
      ) : status.error ? (
        <div className="space-y-2">
          <p className="text-red-500 font-medium">{status.error}</p>

          {status.error.includes('expired') && (
            <button
              onClick={() => navigate('/resend-verification')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Resend Verification Email
            </button>
          )}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline"
          >
            Try registering again
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-green-600 font-medium">{status.message}</p>
          <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  );
}
