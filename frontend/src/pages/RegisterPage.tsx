import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {authApi} from '@/service/authService';

const RegisterPage: React.FC = () => {
    const [form, setForm] = useState({firstName: '', lastName: '', email: '', password: '', confirm: ''});
    const [errors, setErrors] = useState<Partial<typeof form> & { general?: string }>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = () => {
        const e: typeof errors = {};
        if (!form.firstName.trim())
            e.firstName = 'First name required';
        if (!form.lastName.trim())
            e.lastName = 'Last name required';
        if (!form.email)
            e.email = 'Email required';
        else if (!/^\S+@\S+\.\S+$/.test(form.email))
            e.email = 'Enter a valid email';
        if (!form.password)
            e.password = 'Password required';
        else if (form.password.length < 6)
            e.password = 'Minimum 6 characters';
        if (form.password !== form.confirm)
            e.confirm = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await authApi.register({
                email: form.email, password: form.password,
                firstName: form.firstName, lastName: form.lastName,
            });
            if (res.success) {
                setSuccess(true);
            } else {
                setErrors({general: res.message || 'Registration failed'});
            }
        } catch (err: any) {
            setErrors({general: err?.response?.data?.message || 'Registration failed'});
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
                <div className="w-full max-w-md text-center">
                    <div className="bg-cream border border-parchment-200 rounded-xl shadow-card p-10">
                        <div className="text-5xl mb-4">📬</div>
                        <h2 className="font-display text-2xl font-bold text-ink mb-2">Check your inbox!</h2>
                        <p className="font-body text-sm text-ink-400 leading-relaxed mb-6">
                            We've sent a verification link to <strong>{form.email}</strong>. Click it to activate your
                            account.
                        </p>
                        <Link to="/login" className="btn-primary">Go to Sign In</Link>
                    </div>
                </div>
            </div>
        );
    }

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({...p, [k]: e.target.value}));

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
                                    <path d="M12 2C9.5 2 7 3.5 7 6v13l5-2 5 2V6c0-2.5-2.5-4-5-4z"/>
                                </svg>
                            </div>
                            <h1 className="font-display text-2xl font-bold text-ink">Join the Library</h1>
                            <p className="font-body text-sm text-ink-400 italic mt-1">Create your free account</p>
                        </div>

                        {errors.general && (
                            <div
                                className="bg-red-50 border border-red-200 rounded px-3 py-2 mb-4 text-sm font-sans text-red-700">{errors.general}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="label">First Name</label>
                                    <input value={form.firstName} onChange={set('firstName')}
                                           className={`input-field ${errors.firstName ? 'border-red-400' : ''}`}
                                           placeholder="Jane"/>
                                    {errors.firstName &&
                                        <p className="text-red-500 text-xs mt-1 font-sans">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="label">Last Name</label>
                                    <input value={form.lastName} onChange={set('lastName')}
                                           className={`input-field ${errors.lastName ? 'border-red-400' : ''}`}
                                           placeholder="Doe"/>
                                    {errors.lastName &&
                                        <p className="text-red-500 text-xs mt-1 font-sans">{errors.lastName}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="label">Email address</label>
                                <input type="email" value={form.email} onChange={set('email')}
                                       className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                                       placeholder="you@example.com"/>
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <input type="password" value={form.password} onChange={set('password')}
                                       className={`input-field ${errors.password ? 'border-red-400' : ''}`}
                                       placeholder="At least 6 characters"/>
                                {errors.password &&
                                    <p className="text-red-500 text-xs mt-1 font-sans">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="label">Confirm Password</label>
                                <input type="password" value={form.confirm} onChange={set('confirm')}
                                       className={`input-field ${errors.confirm ? 'border-red-400' : ''}`}
                                       placeholder="••••••••"/>
                                {errors.confirm &&
                                    <p className="text-red-500 text-xs mt-1 font-sans">{errors.confirm}</p>}
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-1">
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                    </svg>
                                ) : 'Create Account'}
                            </button>
                        </form>

                        <p className="text-center font-sans text-sm text-ink-400 mt-6">
                            Already a member?{' '}
                            <Link to="/login"
                                  className="text-leather-600 hover:text-leather-800 font-medium transition-colors">Sign
                                in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;