import { useState } from "react";
import Alert from "../components/alert"
import Input from '../components/input'
import Button from "../components/button"
import { Mail } from 'lucide-react';
import { authAPI } from "../api";

const ForgotPassword = ({ onBack }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setAlert(null);

    try {
      const response = await authAPI.forgot_password(emailAddress);

      if (response.success) {
        setAlert({ type: 'success', message: 'Password reset link sent to your email!' });
        setEmailAddress('');
      } else {
        setAlert({ type: 'error', message: response.message || 'Failed to send reset link' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Forgot Password</h2>
      <p className="text-gray-600 mb-6 text-center text-sm">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div>
        <Input
          label="Email Address"
          icon={Mail}
          name="emailAddress"
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder="john@example.com"
          required
        />

        <Button type="submit" loading={loading} onClick={handleSubmit}>
          Send Reset Link
        </Button>

        <Button variant="secondary" onClick={onBack} className="mt-3">
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;