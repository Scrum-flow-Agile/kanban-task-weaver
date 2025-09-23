import AuthForm from '../components/AuthForm';

export default function AuthPage(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthForm />
    </div>
  );
}
