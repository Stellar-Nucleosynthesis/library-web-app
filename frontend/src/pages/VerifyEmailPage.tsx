import React, {useEffect, useState} from 'react';
import {useSearchParams, Link, useNavigate} from 'react-router-dom';
import {authApi} from '@/service/authService';
import {useAuth} from '@/authContext/useAuth';

const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {setAuthData} = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setTimeout(() => {
                setStatus('error');
                setMessage('No verification token provided.');
            }, 0);
            return;
        }

        authApi.verifyEmail(token).then((res) => {
            if (res.success && res.token && res.user) {
                setAuthData(res.token, res.user);
                setStatus('success');
                setTimeout(() => navigate('/catalog'), 2500);
            } else {
                setStatus('error');
                setMessage(res.message || 'Verification failed. The link may have expired.');
            }
        }).catch(() => {
            setStatus('error');
            setMessage('An error occurred during verification. Please try again.');
        });
    }, [navigate, searchParams, setAuthData]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
            <div className="w-full max-w-md text-center">
                <div className="bg-cream border border-parchment-200 rounded-xl shadow-card p-10">
                    {status === 'loading' && (
                        <>
                            <div
                                className="w-14 h-14 border-4 border-parchment-300 border-t-leather-500 rounded-full animate-spin mx-auto mb-5"/>
                            <h2 className="font-display text-2xl font-bold text-ink mb-2">Verifying your email…</h2>
                            <p className="font-body text-sm text-ink-400 italic">Just a moment, please.</p>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <div className="text-5xl mb-4">✅</div>
                            <h2 className="font-display text-2xl font-bold text-ink mb-2">Email Verified!</h2>
                            <p className="font-body text-sm text-ink-400 leading-relaxed mb-4">
                                Your account is now active. Redirecting you to the catalog…
                            </p>
                            <Link to="/catalog" className="btn-primary">Browse Books</Link>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <div className="text-5xl mb-4">❌</div>
                            <h2 className="font-display text-2xl font-bold text-ink mb-2">Verification Failed</h2>
                            <p className="font-body text-sm text-ink-400 leading-relaxed mb-6">{message}</p>
                            <div className="flex gap-3 justify-center">
                                <Link to="/login" className="btn-secondary">Sign In</Link>
                                <Link to="/register" className="btn-primary">Register Again</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
