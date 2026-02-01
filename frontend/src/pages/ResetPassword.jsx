import { useState } from 'react';
import { authAPI } from '../api';

const ResetPassword = ({ token, onDone }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMsg({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const res = await authAPI.reset_password(token, password, confirmPassword);
            if (res.success) {
                setMsg({ type: 'success', text: res.message || 'Password reset successful!' });
                setTimeout(() => {
                    onDone();
                }, 2000);
            } else {
                setMsg({ type: 'error', text: res.message || 'Failed to reset password' });
            }
        } catch (err) {
            setMsg({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

            {msg.text && (
                <div className={`p-3 mb-4 rounded ${msg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Reform new password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200 disabled:opacity-50"
                >
                    {loading ? 'Reseting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
