const Login = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAlert(null);

    try {
      const response = await login(formData.emailAddress, formData.password);
      
      if (response.success) {
        setAlert({ type: 'success', message: 'Login successful!' });
      } else {
        setAlert({ type: 'error', message: response.message || 'Login failed' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred during login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
      
      {alert && <Alert type={alert.type} message={alert.message} />}
      
      <div>
        <Input
          label="Email Address"
          icon={Mail}
          name="emailAddress"
          type="email"
          value={formData.emailAddress}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />
        
        <div className="relative mb-4">
          <Input
            label="Password"
            icon={Lock}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        
        <Button loading={loading} onClick={handleSubmit}>
          Sign In
        </Button>
      </div>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} className="text-blue-600 hover:underline font-medium">
          Sign up
        </button>
      </p>
    </div>
  );
};
