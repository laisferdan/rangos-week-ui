import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cardapio } from '../../core/models/cardapio.model';
import { FoodHistory } from '../../core/models/food-history.model';
import { CardapioService } from './cardapio.service';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private historico: FoodHistory[] = [];
  private nextId = 1;

  constructor(private cardapioService: CardapioService) {}

  /**
   * Adiciona uma refeição ao histórico do usuário
   */
  addToHistory(
    usuarioId: number,
    cardapio: Cardapio,
    avaliacao?: number,
    preferencia?: 'gostei' | 'não gostei' | 'indiferente'
  ): Observable<FoodHistory> {
    const novoHistorico: FoodHistory = {
      id: this.nextId++,
      usuarioId,
      cardapio: { ...cardapio },
      data: new Date(),
      avaliacao,
      preferencia,
    };

    this.historico.push(novoHistorico);
    return of(novoHistorico);
  }

  /**
   * Obtém o histórico de refeições de um usuário
   */
  getUserHistory(usuarioId: number): Observable<FoodHistory[]> {
    return of(this.historico.filter((item) => item.usuarioId === usuarioId));
  }

  /**
   * Gera recomendações com base no histórico do usuário
   */
  generateRecommendations(
    usuarioId: number,
    limite: number = 5
  ): Observable<Cardapio[]> {
    return new Observable((subscriber) => {
      this.cardapioService.getAlimentoOptions().subscribe((todosAlimentos) => {
        const historicoUsuario = this.historico.filter(
          (item) => item.usuarioId === usuarioId
        );

        // Se não houver histórico, retorna alimentos aleatórios
        if (historicoUsuario.length === 0) {
          const recommendations = this.getRandomItems(todosAlimentos, limite);
          subscriber.next(recommendations);
          subscriber.complete();
          return;
        }

        // Calcula pontuação para cada alimento com base no histórico
        const alimentosComPontuacao = todosAlimentos.map((alimento) => ({
          alimento,
          pontuacao: this.calculateScore(alimento, historicoUsuario),
        }));

        // Ordena por pontuação (maior primeiro) e pega os melhores
        const recommendations = alimentosComPontuacao
          .sort((a, b) => b.pontuacao - a.pontuacao)
          .slice(0, limite)
          .map((item) => item.alimento);

        subscriber.next(recommendations);
        subscriber.complete();
      });
    });
  }

  /**
   * Calcula uma pontuação para um alimento com base no histórico do usuário
   */
  private calculateScore(alimento: Cardapio, historico: FoodHistory[]): number {
    let pontuacao = 0;

    // Peso maior para preferências explícitas
    const preferencias = historico.filter(
      (h) =>
        h.preferencia && h.cardapio.nome_categoria === alimento.nome_categoria
    );

    // Soma as preferências (gostei = +2, não gostei = -2, indiferente = 0)
    pontuacao += preferencias.reduce((acc, curr) => {
      if (curr.preferencia === 'gostei') return acc + 2;
      if (curr.preferencia === 'não gostei') return acc - 2;
      return acc;
    }, 0);

    // Considera avaliações (1-5 estrelas)
    const avaliacoes = historico
      .filter(
        (h) =>
          h.avaliacao && h.cardapio.nome_categoria === alimento.nome_categoria
      )
      .map((h) => h.avaliacao || 0);

    if (avaliacoes.length > 0) {
      const mediaAvaliacoes =
        avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length;
      pontuacao += mediaAvaliacoes * 0.5; // Peso menor para avaliações
    }

    // Prefere alimentos da mesma categoria que o usuário costuma consumir
    const categoriasFrequentes = this.getMostFrequentCategories(historico);
    if (categoriasFrequentes.includes(alimento.nome_categoria)) {
      pontuacao += 1;
    }

    // Adiciona um fator de aleatoriedade para variar as sugestões
    pontuacao += Math.random() * 0.5;

    return pontuacao;
  }

  /**
   * Obtém as categorias mais frequentes no histórico
   */
  private getMostFrequentCategories(historico: FoodHistory[]): string[] {
    const contagemCategorias = new Map<string, number>();

    historico.forEach((item) => {
      const categoria = item.cardapio.nome_categoria;
      contagemCategorias.set(
        categoria,
        (contagemCategorias.get(categoria) || 0) + 1
      );
    });

    return Array.from(contagemCategorias.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([categoria]) => categoria)
      .slice(0, 3); // Retorna as 3 categorias mais frequentes
  }

  /**
   * Retorna itens aleatórios de um array
   */
  private getRandomItems(array: any[], count: number): any[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
