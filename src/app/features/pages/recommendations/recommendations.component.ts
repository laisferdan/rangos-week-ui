import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cardapio } from '../../../core/models/cardapio.model';
import { RecommendationService } from '../../../shared/services/recommendation.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
})
export class RecommendationsComponent implements OnInit {
  recommendations: Cardapio[] = [];
  carregando = false;
  erro: string | null = null;

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.carregando = true;
    this.erro = null;

    this.recommendationService.generateRecommendations(1, 5).subscribe({
      next: (recommendations) => {
        this.recommendations = recommendations;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar recomendações:', erro);
        this.erro =
          'Erro ao carregar recomendações. Tente novamente mais tarde.';
        this.carregando = false;
      },
    });
  }

  evaluateRecommendation(alimento: Cardapio, gostou: boolean): void {
    const preferencia = gostou ? 'gostei' : ('não gostei' as const);

    this.recommendationService
      .addToHistory(
        1,
        alimento,
        gostou ? 5 : 1, // Avaliação de 1 a 5 estrelas
        preferencia
      )
      .subscribe({
        next: () => {
          // Recarrega as recomendações após a avaliação
          this.loadRecommendations();
        },
        error: (erro) => {
          console.error('Erro ao avaliar recomendação:', erro);
        },
      });
  }
}
