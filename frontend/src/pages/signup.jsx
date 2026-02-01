import { useState } from "react";
import Alert from "../components/alert"
import Input from '../components/input'
import Button from "../components/button"
import { Mail, Eye, EyeOff, Lock, User, Phone, MapPin } from 'lucide-react';
import { authAPI } from "../api";

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    emailAddress: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    lat: '',
    long: '',
    consent: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setFormData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          long: position.coords.longitude
        }));
      }, function (error) {
        console.error("Error getting location:", error);
        setErrors(prev => ({ ...prev, lat: 'Could not fetch location' }));
      });
    } else {
      setErrors(prev => ({ ...prev, lat: 'Geolocation not supported' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.emailAddress = 'Valid email is required';
    }
    if (!formData.phoneNumber.match(/^\d{10,15}$/)) {
      newErrors.phoneNumber = 'Valid phone number is required (10-15 digits)';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must accept the terms';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const { confirmPassword, lat, long, ...rest } = formData;
      const submitData = {
        ...rest,
        // Only include location if provided
        userLocation: (lat && long) ? { lat: Number(lat), long: Number(long) } : undefined
      };

      const response = await authAPI.signup(submitData);

      if (response.success) {
        setAlert({ type: 'success', message: 'Registration successful! Please check your email to confirm your account.' });
        setTimeout(() => onSwitchToLogin(), 3000);
      } else {
        setAlert({ type: 'error', message: response.message || 'Registration failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred during registration' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

      {alert && <Alert type={alert.type} message={alert.message} />}

      <div>
        <Input
          label="Full Name"
          icon={User}
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="John Doe"
        />

        <Input
          label="Email Address"
          icon={Mail}
          name="emailAddress"
          type="email"
          value={formData.emailAddress}
          onChange={handleChange}
          error={errors.emailAddress}
          placeholder="john@example.com"
        />

        <Input
          label="Phone Number"
          icon={Phone}
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          placeholder="1234567890"
        />

        <div className="flex gap-2 mb-4">
          <div className="flex-1">
            <Input
              label="Latitude"
              icon={MapPin}
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              error={errors.lat}
              placeholder="0.00"
            />
          </div>
          <div className="flex-1">
            <Input
              label="Longitude"
              icon={MapPin}
              name="long"
              value={formData.long}
              onChange={handleChange}
              error={errors.long}
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="mb-4">
          <button type="button" onClick={handleGetLocation} className="text-sm text-blue-600 underline">
            Get My Current Location
          </button>
        </div>

        <div className="relative mb-4">
          <Input
            label="Password"
            icon={Lock}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <Input
          label="Confirm Password"
          icon={Lock}
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
        />

        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree to the terms and conditions
            </span>
          </label>
          {errors.consent && <p className="mt-1 text-sm text-red-600">{errors.consent}</p>}
        </div>

        <Button type="submit" loading={loading} onClick={handleSubmit}>
          Create Account
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-blue-600 hover:underline font-medium">
          Sign in
        </button>
      </p>
    </div>
  );
};

export default Register;
