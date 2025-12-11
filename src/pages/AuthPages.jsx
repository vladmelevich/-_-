import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('welcomeBack')}</h1>
          <p className="text-gray-400">{t('loginToAccount')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">{t('username')}</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0b0713] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('enterUsername')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0713] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('enterPassword')}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primaryHover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            {t('signIn')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          {t('noAccount')}{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            {t('signUp')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(username, password)) {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('createAccount')}</h1>
          <p className="text-gray-400">{t('joinUs')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">{t('username')}</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0b0713] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('createNickname')}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="email"
                className="w-full bg-[#0b0713] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0713] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t('createPassword')}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-accent to-green-400 text-black font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            {t('signUp')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          {t('haveAccount')}{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            {t('signIn')}
          </Link>
        </div>
      </div>
    </div>
  );
};

