import { Cardapio } from './cardapio.model';

export interface FoodHistory {
  id: number;
  usuarioId: number;
  cardapio: Cardapio;
  data: Date;
  avaliacao?: number; // 1-5 estrelas
  preferencia?: 'gostei' | 'não gostei' | 'indiferente';
}
