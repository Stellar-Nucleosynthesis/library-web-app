import React, {useState} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {useAuth} from "@/authContext/useAuth.ts";

const Navbar: React.FC = () => {
    const {user, isAdmin, logout} = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const navLinkClass = ({isActive}: { isActive: boolean }) =>
        `font-sans text-sm font-medium transition-colors duration-200 pb-0.5 border-b-2 ${
            isActive
                ? 'text-leather-600 border-amber-book'
                : 'text-ink-400 border-transparent hover:text-leather-600 hover:border-leather-300'
        }`;

    return (
        <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-parchment-300 shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div
                            className="w-9 h-9 bg-leather-500 rounded flex items-center justify-center shadow-sm group-hover:bg-leather-600 transition-colors">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-parchment-100 fill-current">
                                <path
                                    d="M12 2C9.5 2 7 3.5 7 6v13l5-2 5 2V6c0-2.5-2.5-4-5-4zm0 2c1.8 0 3 1 3 2v10.5l-3-1.2-3 1.2V6c0-1 1.2-2 3-2z"/>
                            </svg>
                        </div>
                        <div>
                            <span className="font-display text-lg font-bold text-ink leading-none block">Library</span>
                            <span className="font-sans text-xs text-leather-500 leading-none tracking-widest uppercase">Resource Center</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-7">
                        <NavLink to="/catalog" className={navLinkClass}>Catalog</NavLink>
                        {isAdmin && (
                            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="font-sans text-xs font-medium text-ink-600">{user.firstName} {user.lastName}</p>
                                    <p className="font-sans text-xs text-ink-300 capitalize">{user.role}</p>
                                </div>
                                <div
                                    className="w-8 h-8 bg-leather-500 rounded-full flex items-center justify-center text-parchment-100 font-sans font-bold text-sm">
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                                <button onClick={handleLogout} className="btn-ghost text-sm py-1.5 px-3 text-ink-400">
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost text-sm py-1.5 px-4">Sign in</Link>
                                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Join Library</Link>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden p-2 rounded text-ink-500 hover:bg-parchment-200 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {menuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"/>
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"/>}
                        </svg>
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden border-t border-parchment-200 py-3 space-y-2 animate-fade-in">
                        <NavLink to="/catalog"
                                 className="block px-3 py-2 font-sans text-sm text-ink-500 hover:bg-parchment-100 rounded"
                                 onClick={() => setMenuOpen(false)}>Catalog</NavLink>
                        {isAdmin && (
                            <NavLink to="/admin"
                                     className="block px-3 py-2 font-sans text-sm text-ink-500 hover:bg-parchment-100 rounded"
                                     onClick={() => setMenuOpen(false)}>Admin</NavLink>
                        )}
                        <div className="border-t border-parchment-200 pt-2 mt-2">
                            {user ? (
                                <>
                                    <p className="px-3 py-1 font-sans text-xs text-ink-400">{user.firstName} {user.lastName}</p>
                                    <button onClick={handleLogout}
                                            className="block w-full text-left px-3 py-2 font-sans text-sm text-ink-500 hover:bg-parchment-100 rounded">Sign
                                        out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login"
                                          className="block px-3 py-2 font-sans text-sm text-ink-500 hover:bg-parchment-100 rounded"
                                          onClick={() => setMenuOpen(false)}>Sign in</Link>
                                    <Link to="/register"
                                          className="block px-3 py-2 font-sans text-sm font-medium text-leather-600 hover:bg-parchment-100 rounded"
                                          onClick={() => setMenuOpen(false)}>Join Library</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
