import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/resend-verification`,
        { email }
      );
      setMessage('New verification email sent!');
      setError('');
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Failed to resend email');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-4 rounded-lg bg-white shadow">
      <h2 className="text-2xl font-bold text-center">Resend Verification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Resend Email
        </button>
      </form>

      {message && <p className="text-green-600 text-center">{message}</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}
