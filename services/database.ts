import { Sale } from '../types';
import { supabase } from './supabase';

export const database = {
  sales: {
    // Busca todas as vendas do usuário logado
    getAll: async (): Promise<Sale[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao buscar vendas:', error);
          return [];
        }

        // Mapeia os dados brutos (raw_data) de volta para o objeto Sale
        return data.map((row: any) => ({
          ...row.raw_data,
          id: row.id, // Garante que o ID do banco seja o principal
          userId: row.user_id
        }));
      } catch (e) {
        console.error("Erro inesperado ao buscar vendas", e);
        return [];
      }
    },

    // Salva ou Atualiza uma venda
    save: async (sale: Sale): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('sales').upsert({
        id: sale.id,
        user_id: user.id,
        client_name: sale.clientName,
        sale_date: sale.saleDate,
        project: sale.project,
        sale_value: sale.saleValue,
        commission_total: sale.commissionTotal,
        raw_data: sale // Armazena o JSON completo para manter a estrutura complexa (arrays de pagamentos, etc)
      });

      if (error) console.error('Erro ao salvar venda:', error);
    },

    // Remove uma venda
    delete: async (saleId: string): Promise<void> => {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);
      
      if (error) console.error('Erro ao deletar venda:', error);
    }
  }
};