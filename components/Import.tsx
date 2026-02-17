import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Check, Loader2, AlertCircle, Download, Table, Info, ArrowRight } from 'lucide-react';
import { Sale, RoleType, PaymentMethod } from '../types';
import Papa from 'papaparse';

interface ImportProps {
  onReviewSale: (data: Partial<Sale>) => void;
}

const Import: React.FC<ImportProps> = ({ onReviewSale }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedSales, setImportedSales] = useState<Partial<Sale>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredColumns = [
    { id: 'cliente', label: 'Nome do Cliente', desc: 'Nome completo' },
    { id: 'data', label: 'Data', desc: 'AAAA-MM-DD' },
    { id: 'projeto', label: 'Projeto', desc: 'Ex: Areya Barra' },
    { id: 'categoria', label: 'Categoria', desc: 'Ex: Faixa 1' },
    { id: 'cargo', label: 'Cargo', desc: 'FTB, LINER ou CLOSER' },
    { id: 'valor_venda', label: 'Valor Venda', desc: 'Valor total' },
    { id: 'valor_entrada', label: 'Valor Entrada', desc: 'Entrada total' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setError(null);
        setImportedSales([]);
      } else {
        setError('Por favor, selecione um arquivo no formato CSV.');
        setSelectedFile(null);
      }
    }
  };

  const processFile = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = results.data.map((row: any) => {
            const getVal = (keys: string[]) => {
              const foundKey = Object.keys(row).find(k => keys.includes(k.toLowerCase().trim()));
              return foundKey ? row[foundKey] : null;
            };

            const entryPayments = [];
            const sinalVal = parseFloat(getVal(['sinal', 'valor_sinal', 'entrada_sinal']) || '0');
            const entryVal = parseFloat(getVal(['valor_entrada', 'entrada_total']) || '0');
            const parcelasCount = parseInt(getVal(['parcelas_entrada', 'qtd_parcelas']) || '0');
            
            if (sinalVal > 0) {
              entryPayments.push({
                id: Math.random().toString(36),
                method: (getVal(['metodo_sinal', 'forma_sinal']) || 'pix') as PaymentMethod,
                amount: sinalVal,
                installments: 1
              });
            }

            if (parcelasCount > 0 && entryVal > sinalVal) {
              entryPayments.push({
                id: Math.random().toString(36),
                method: (getVal(['metodo_parcelas', 'forma_parcelas']) || 'boleto') as PaymentMethod,
                amount: entryVal - sinalVal,
                installments: parcelasCount
              });
            }

            return {
              clientName: getVal(['cliente', 'nome', 'comprador']),
              saleDate: getVal(['data', 'data_venda', 'venda_data']),
              project: getVal(['projeto', 'empreendimento']),
              category: getVal(['categoria', 'faixa', 'tipo']),
              role: (getVal(['cargo', 'funcao']) || 'FTB').toUpperCase() as RoleType,
              saleValue: parseFloat(getVal(['valor_venda', 'tabela', 'valor_total']) || '0'),
              entryTableValue: entryVal,
              entryPayments,
              observation: getVal(['observacao', 'obs', 'notas']),
              quotaQty: 1,
              sourceType: 'import_excel' as const
            } as Partial<Sale>;
          });

          const validSales = parsedData.filter(s => s.clientName && s.project);
          
          if (validSales.length === 0) {
            setError('Não foram encontrados dados válidos. Verifique se as colunas (cliente, projeto, etc) existem.');
          } else {
            setImportedSales(validSales);
          }
        } catch (err) {
          setError('Erro ao processar arquivo. Verifique se os valores numéricos usam ponto (ex: 3990.00).');
        } finally {
          setIsProcessing(false);
        }
      },
      error: () => {
        setError('Erro ao ler o arquivo CSV.');
        setIsProcessing(false);
      }
    });
  };

  const downloadTemplate = () => {
    const headers = "cliente,data,projeto,categoria,cargo,valor_venda,valor_entrada,sinal,metodo_sinal,parcelas_entrada,metodo_parcelas,observacao";
    const example = "João Silva,2024-05-20,Areya Barra,Faixa 1,FTB,75000.00,3990.00,1000.00,pix,3,boleto,Venda Corredor";
    const blob = new Blob([`${headers}\n${example}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_multicota.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 pb-24">
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-start">
        <div className="flex-1">
          <h2 className="text-4xl font-black text-white mb-4">Importação de Dados</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Sincronize suas vendas em lote. Nossa inteligência processa sua planilha e prepara os cálculos de comissão automaticamente.
          </p>
          
          <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-3xl flex items-start gap-4">
            <Info className="text-blue-400 shrink-0" size={24} />
            <div>
              <p className="text-sm text-blue-100 font-bold mb-1">Dica de Formatação</p>
              <p className="text-xs text-blue-200/70 leading-relaxed">
                Salve seu Excel como <strong>CSV (Separado por vírgulas)</strong>. Use ponto para decimais (ex: 1250.50) e datas no formato AAAA-MM-DD.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 bg-cardBg border border-gray-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Colunas Necessárias</h3>
          <div className="space-y-4">
            {requiredColumns.map(col => (
              <div key={col.id} className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-bold text-gray-200 group-hover:text-neon transition-colors">{col.label}</p>
                  <p className="text-[10px] text-gray-500">{col.desc}</p>
                </div>
                <Check size={14} className="text-gray-700 group-hover:text-neon" />
              </div>
            ))}
          </div>
          <button 
            onClick={downloadTemplate}
            className="w-full mt-8 py-3 border border-gray-800 hover:border-neon/50 text-gray-400 hover:text-neon rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Download size={14} /> Baixar Modelo CSV
          </button>
        </div>
      </div>

      {!selectedFile ? (
        <div 
          className="bg-darkBg/50 border-2 border-dashed rounded-3xl p-16 text-center transition-all cursor-pointer border-gray-800 hover:border-neon hover:bg-neon/5 group" 
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv" />
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-neon group-hover:scale-110 transition-all">
            <UploadCloud size={32} className="text-gray-500 group-hover:text-darkBg" />
          </div>
          <p className="text-gray-200 font-black text-xl mb-2">Selecione seu arquivo CSV</p>
          <p className="text-gray-500 text-sm">Arraste e solte ou clique para navegar</p>
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          <div className="bg-cardBg border border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center text-neon">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedFile.name}</h3>
                <p className="text-sm text-gray-500">Pronto para processar • {(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setSelectedFile(null); setImportedSales([]); setError(null); }}
                className="px-6 py-3 text-gray-400 font-bold hover:text-white transition-colors"
              >
                Cancelar
              </button>
              {importedSales.length === 0 && (
                <button 
                  onClick={processFile} 
                  disabled={isProcessing}
                  className="px-8 py-3 bg-neon text-darkBg font-black rounded-2xl hover:bg-neon/90 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Table size={18} />}
                  Processar Dados
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-start gap-4 animate-fade-in">
              <AlertCircle className="text-red-500 mt-1" size={20} />
              <div>
                <p className="text-red-400 font-bold">Erro de Processamento</p>
                <p className="text-red-400/70 text-sm">{error}</p>
              </div>
            </div>
          )}

          {importedSales.length > 0 && (
            <div className="grid gap-4 animate-fade-in">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Vendas encontradas ({importedSales.length})</p>
              {importedSales.map((sale, i) => (
                <div key={i} className="bg-cardBg border border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-gray-700 transition-all shadow-lg group">
                  <div className="flex flex-col md:flex-row gap-8 flex-1">
                    <div className="w-full md:w-64">
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Cliente</p>
                      <p className="text-white font-black truncate">{sale.clientName}</p>
                      <p className="text-xs text-gray-500 mt-1">{sale.saleDate}</p>
                    </div>
                    
                    <div className="w-full md:w-48">
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Dados do Imóvel</p>
                      <p className="text-gray-300 text-sm font-bold truncate">{sale.project}</p>
                      <p className="text-[10px] text-neon uppercase font-black">{sale.category}</p>
                    </div>

                    <div className="w-full md:w-32">
                      <p className="text-[10px] text-gray-500 uppercase font-black mb-1">Financeiro</p>
                      <p className="text-white text-sm font-bold">Entrada: R$ {sale.entryTableValue}</p>
                      <p className="text-[10px] text-gray-500">{sale.role}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => onReviewSale(sale)}
                    className="w-full md:w-auto px-6 py-4 bg-gray-800 text-white hover:bg-neon hover:text-darkBg font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group-hover:scale-[1.05]"
                  >
                    Revisar Venda <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Import;