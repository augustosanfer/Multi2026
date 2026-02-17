import React from 'react';
import { Handshake, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 min-h-[70vh] flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="relative rounded-3xl p-8 md:p-12 border border-neon/20 bg-gradient-to-b from-cardBg/90 to-darkBg shadow-[0_0_50px_rgba(124,255,79,0.05)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_0%,rgba(124,255,79,0.15),transparent_50%)] pointer-events-none" />
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse"></span>
                <span className="text-neon text-xs font-bold tracking-wider uppercase">Versão 2026 • Gestão Profissional</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                Controle suas vendas e <span className="text-neon">comissões pro-rata</span> automaticamente.
              </h1>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                O MultiCota calcula exatamente quanto você recebe da entrada e projeta seu fluxo de caixa futuro de forma inteligente e segura.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={onCtaClick}
                  className="px-8 py-4 bg-neon text-darkBg font-black rounded-2xl hover:bg-neon/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(124,255,79,0.2)]"
                >
                  <Lock size={20} />
                  Acessar Plataforma
                  <ArrowRight size={20} />
                </button>
                <a 
                  href="#plans"
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  Ver Planos
                </a>
              </div>
              
              <div className="flex flex-wrap gap-3">
                 {["Cálculo Pro-Rata", "Fluxo de Caixa", "Gestão de Recebíveis"].map((feat, i) => (
                   <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-sm text-gray-300">
                      <CheckCircle2 size={14} className="text-neon" /> {feat}
                   </div>
                 ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
               <div className="w-72 h-72 md:w-96 md:h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-neon to-neonDark rounded-[3rem] rotate-6 opacity-20 blur-2xl"></div>
                  <div className="absolute inset-0 bg-cardBg border border-neon/30 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,255,79,0.1),transparent)]"></div>
                    <Handshake size={120} className="text-neon drop-shadow-[0_0_15px_rgba(124,255,79,0.5)]" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;