import React, {Suspense} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import {AuthProvider} from './authContext/AuthProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ui/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CatalogPage from "./pages/CatalogPage.tsx";
import BookDetailPage from "./pages/BookDetailPage.tsx";
import AdminPage from "./pages/AdminPage";
import VerifyEmailPage from "./pages/VerifyEmailPage.tsx";
import NotFoundPage from "./pages/NotFoundPage";

const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-parchment-300 border-t-leather-500 rounded-full animate-spin"/>
            <p className="font-body text-sm text-ink-300 italic">Opening the book…</p>
        </div>
    </div>
);

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar/>
                    <main className="flex-1">
                        <Suspense fallback={<PageLoader/>}>
                            <Routes>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/catalog" element={<CatalogPage/>}/>
                                <Route path="/book/:id" element={<BookDetailPage/>}/>
                                <Route path="/login" element={<LoginPage/>}/>
                                <Route path="/register" element={<RegisterPage/>}/>
                                <Route path="/verify-email" element={<VerifyEmailPage/>}/>
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <AdminPage/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/404" element={<NotFoundPage/>}/>
                                <Route path="*" element={<Navigate to="/404" replace/>}/>
                            </Routes>
                        </Suspense>
                    </main>
                    <Footer/>
                </div>

                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            background: '#fffdf7',
                            color: '#3d2518',
                            border: '1px solid #d4b896',
                            fontFamily: '"Source Sans 3", sans-serif',
                            fontSize: '14px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 16px rgba(61, 37, 24, 0.15)',
                        },
                        success: {
                            iconTheme: {primary: '#9a5e30', secondary: '#fffdf7'},
                        },
                        error: {
                            iconTheme: {primary: '#b91c1c', secondary: '#fff'},
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
