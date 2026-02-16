import React from 'react';
import { User } from '../types';
import { Shield, CheckCircle, Clock, Search, Link, Copy, Check } from 'lucide-react';

interface AdminUsersProps {
  users: User[];
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users }) => {
  const [copied, setCopied] = React.useState(false);

  const copySignupLink = () => {
    const signupUrl = `${window.location.origin}/?show_signup=true`;
    navigator.clipboard.writeText(signupUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="text-neon" size={32} /> Gestão de Usuários
          </h2>
          <p className="text-gray-400">Administre quem tem acesso ao sistema.</p>
        </div>
        
        <button 
          onClick={copySignupLink}
          className="flex items-center gap-2 px-4 py-2 bg-neon/10 border border-neon/30 text-neon rounded-xl hover:bg-neon/20 transition-all font-bold text-sm"
        >
          {copied ? <Check size={18} /> : <Link size={18} />}
          {copied ? 'Link Copiado!' : 'Copiar Link de Cadastro Oculto'}
        </button>
      </div>

      <div className="bg-cardBg border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-darkBg/50">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar usuário..." 
              className="w-full bg-darkBg border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-neon outline-none" 
            />
          </div>
          <div className="text-gray-400 text-sm">Total: <strong className="text-white">{users.length}</strong></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-darkBg text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Usuário</th>
                <th className="px-6 py-4 font-bold">E-mail</th>
                <th className="px-6 py-4 font-bold">Tipo</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                    Nenhum usuário cadastrado além de você.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-medium text-sm">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold uppercase ${user.role === 'admin' ? 'text-neon' : 'text-gray-500'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.subscriptionStatus === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold">
                          <CheckCircle size={12}/> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold">
                          <Clock size={12}/> Pendente
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
        <p className="text-xs text-blue-400 leading-relaxed">
          <strong>Dica de Segurança:</strong> O link acima permite que qualquer pessoa crie uma conta. 
          Use-o apenas com clientes que já pagaram. Após o cadastro do cliente, você pode desativar o link 
          ou simplesmente não compartilhá-lo mais.
        </p>
      </div>
    </div>
  );
};
export default AdminUsers;