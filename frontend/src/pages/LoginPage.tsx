import React, {useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import toast from 'react-hot-toast';
import {useAuth} from '@/authContext/useAuth';

const LoginPage: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({email: '', password: ''});
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [loading, setLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);

    const sessionExpired = searchParams.get('session') === 'expired';

    const validate = () => {
        const e: typeof errors = {};
        if (!form.email)
            e.email = 'Email required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email))
            e.email = 'Enter a valid email';
        if (!form.password)
            e.password = 'Password required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate())
            return;
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            navigate('/catalog');
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Login failed';
            if (err?.response?.data?.needsVerification) setNeedsVerification(true);
            setErrors({general: msg});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="bg-cream border border-parchment-200 rounded-xl shadow-card-hover overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-leather-500 via-amber-book to-leather-600"/>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div
                                className="w-14 h-14 bg-leather-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <svg viewBox="0 0 24 24" className="w-7 h-7 text-parchment-100 fill-current">
                                    <path
                                        d="M12 2C9.5 2 7 3.5 7 6v13l5-2 5 2V6c0-2.5-2.5-4-5-4zm0 2c1.8 0 3 1 3 2v10.5l-3-1.2-3 1.2V6c0-1 1.2-2 3-2z"/>
                                </svg>
                            </div>
                            <h1 className="font-display text-2xl font-bold text-ink">Welcome Back</h1>
                            <p className="font-body text-sm text-ink-400 italic mt-1">Sign in to access the library</p>
                        </div>

                        {sessionExpired && (
                            <div
                                className="bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-4 text-sm font-sans text-amber-800">
                                Your session expired. Please sign in again.
                            </div>
                        )}

                        {errors.general && (
                            <div
                                className="bg-red-50 border border-red-200 rounded px-3 py-2 mb-4 text-sm font-sans text-red-700">
                                {errors.general}
                                {needsVerification && (
                                    <button className="ml-2 underline text-red-600"
                                            onClick={() => toast('Check your inbox for the verification email')}>
                                        Resend?
                                    </button>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">Email address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                    className={`input-field ${errors.password ? 'border-red-400' : ''}`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {errors.password &&
                                    <p className="text-red-500 text-xs mt-1 font-sans">{errors.password}</p>}
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        <div className="ornament mt-6">
                            <span className="font-sans text-xs text-ink-300">or</span>
                        </div>

                        <p className="text-center font-sans text-sm text-ink-400 mt-4">
                            New to the library?{' '}
                            <Link to="/register"
                                  className="text-leather-600 hover:text-leather-800 font-medium transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;