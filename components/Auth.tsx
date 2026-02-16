import React, { useState } from 'react';
import { User } from '../types';
import { Handshake, Mail, Lock, Loader2, AlertCircle, UserPlus, Wand2, ArrowRight, WifiOff } from 'lucide-react';
import { authService } from '../services/supabase';

interface AuthProps {
  onSuccess: (user: User) => void;
  onCancel: () => void;
  allowRegistration?: boolean;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, onCancel, allowRegistration = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsNetworkError(false);
    setIsLoading(true);
    
    try {
      if (isLogin) {
        if (useMagicLink) {
          const { error: magicErr } = await authService.signInWithMagicLink(email);
          if (magicErr) {
            setError(magicErr.message);
            setIsLoading(false);
          } else {
            setMagicLinkSent(true);
            setIsLoading(false);
          }
        } else {
          const { data, error: loginErr } = await authService.signIn(email, password);
          if (loginErr) {
            setError(loginErr.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : loginErr.message);
            setIsLoading(false);
          } else if (data.user) {
            onSuccess({
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata.name || 'Usuário',
              role: 'user',
              subscriptionStatus: 'active',
              createdAt: data.user.created_at
            });
          }
        }
      } else {
        const { data, error: signUpErr } = await authService.signUp(email, password, name);
        if (signUpErr) {
          setError(signUpErr.message);
          setIsLoading(false);
        } else {
          alert('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
          setIsLogin(true);
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      setIsNetworkError(true);
      setError('Não foi possível conectar ao servidor. Por favor, verifique sua internet ou desative bloqueadores de anúncios (AdBlock) para este site.');
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-cardBg border border-neon/20 rounded-[2.5rem] p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-6 text-neon border border-neon/20 animate-pulse">
            <Mail size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Link Enviado!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Enviamos um acesso exclusivo para <strong className="text-white">{email}</strong>. 
            Clique no botão dentro do e-mail para entrar instantaneamente.
          </p>
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-gray-800 text-white font-bold rounded-2xl hover:bg-gray-700 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-cardBg border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/50 to-transparent"></div>
        
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-neon border border-neon/20">
            {isLogin ? (useMagicLink ? <Wand2 size={28} /> : <Handshake size={28} />) : <UserPlus size={28} />}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isLogin ? (useMagicLink ? 'Link Mágico' : 'Acessar Conta') : 'Criar Conta'}
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            {isLogin ? (useMagicLink ? 'Receba um link de acesso por e-mail.' : 'Entre com suas credenciais.') : 'Preencha os dados abaixo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-gray-500 group-focus-within:text-neon transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Seu Nome Completo" 
                required 
                className="w-full bg-darkBg border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-neon focus:ring-1 focus:ring-neon/20 outline-none transition-all" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
          )}
          <div className="relative group">
            <Mail className="absolute left-4 top-4 text-gray-500 group-focus-within:text-neon transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              required 
              className="w-full bg-darkBg border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-neon focus:ring-1 focus:ring-neon/20 outline-none transition-all" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          {(!useMagicLink || !isLogin) && (
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-gray-500 group-focus-within:text-neon transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Senha de acesso" 
                required 
                className="w-full bg-darkBg border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-neon focus:ring-1 focus:ring-neon/20 outline-none transition-all" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>
          )}

          {error && (
            <div className={`flex items-start gap-3 text-sm p-4 rounded-2xl animate-fade-in ${isNetworkError ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-red-400/5 border border-red-400/10 text-red-400'}`}>
              {isNetworkError ? <WifiOff size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full py-4 bg-neon text-darkBg font-black rounded-2xl hover:bg-neon/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(124,255,79,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>
                {isLogin ? (useMagicLink ? 'Enviar Link de Acesso' : 'Entrar Agora') : 'Criar Minha Conta'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4 items-center">
          {isLogin && (
            <button 
              onClick={() => { setUseMagicLink(!useMagicLink); setError(''); setIsNetworkError(false); }}
              className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2 transition-colors"
            >
              {useMagicLink ? 'Usar senha tradicional' : 'Entrar com Link Mágico (Sem Senha)'}
            </button>
          )}

          {allowRegistration && (
            <button 
              onClick={() => { setIsLogin(!isLogin); setUseMagicLink(false); setError(''); setIsNetworkError(false); }}
              className="text-sm font-bold text-neon hover:text-neon/80 transition-colors"
            >
              {isLogin ? 'Não tem acesso? Cadastre-se aqui' : 'Já tem uma conta? Faça login'}
            </button>
          )}
          
          {!allowRegistration && isLogin && (
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Acesso Restrito a Assinantes</p>
          )}
        </div>

        <button 
          onClick={onCancel} 
          className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors p-2"
        >
          <span className="sr-only">Fechar</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Auth;