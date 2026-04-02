import React from 'react';
import {Link} from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-ink border-t border-ink-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-7 h-7 bg-amber-book rounded flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
                                    <path
                                        d="M12 2C9.5 2 7 3.5 7 6v13l5-2 5 2V6c0-2.5-2.5-4-5-4zm0 2c1.8 0 3 1 3 2v10.5l-3-1.2-3 1.2V6c0-1 1.2-2 3-2z"/>
                                </svg>
                            </div>
                            <span
                                className="font-display text-parchment-100 font-semibold">Library Resource Center</span>
                        </div>
                        <p className="font-body text-sm text-parchment-400 italic leading-relaxed">
                            "A room without books is like a body without a soul."
                        </p>
                        <p className="font-sans text-xs text-parchment-600 mt-1">— Marcus Tullius Cicero</p>
                    </div>

                    <div>
                        <h4 className="font-display text-parchment-400 font-semibold mb-3">Explore</h4>
                        <ul className="space-y-2">
                            <li><Link to="/catalog"
                                      className="font-sans text-sm text-parchment-400 hover:text-parchment-200 transition-colors">Browse
                                Catalog</Link></li>
                            <li><Link to="/catalog?category=Fiction"
                                      className="font-sans text-sm text-parchment-400 hover:text-parchment-200 transition-colors">Fiction</Link>
                            </li>
                            <li><Link to="/catalog?category=Science"
                                      className="font-sans text-sm text-parchment-400 hover:text-parchment-200 transition-colors">Science</Link>
                            </li>
                            <li><Link to="/catalog?category=History"
                                      className="font-sans text-sm text-parchment-400 hover:text-parchment-200 transition-colors">History</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-display text-parchment-400 font-semibold mb-3">Account</h4>
                        <ul className="space-y-2">
                            <li><Link to="/login"
                                      className="font-sans text-sm text-parchment-400 hover:text-parchment-200 transition-colors">Sign
                                In</Link></li>
                            <li><Link to="/register"
                                      className="font-sans text-sm text-parchment-400 hover:text-parchment-200 transition-colors">Register</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    className="border-t border-ink-700 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="font-sans text-xs text-parchment-600">
                        © {new Date().getFullYear()} Library Resource Center. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1 text-parchment-600">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C9.5 2 7 3.5 7 6v13l5-2 5 2V6c0-2.5-2.5-4-5-4z"/>
                        </svg>
                        <span className="font-sans text-xs">Built with love for readers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
