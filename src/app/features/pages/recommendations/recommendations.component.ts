import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cardapio } from '../../../core/models/cardapio.model';
import { RecommendationService } from '../../../shared/services/recommendation.service';
import { MessageService } from 'primeng/api';
import { friendlyHttpError } from '../../../core/utils/http-error.util';

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

  constructor(
    private recommendationService: RecommendationService,
    private router: Router,
    private messageService: MessageService
  ) {}

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
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: friendlyHttpError(
            erro,
            'Erro ao carregar recomendações.'
          ),
          life: 4000,
        });
        this.erro =
          'Erro ao carregar recomendações. Tente novamente mais tarde.';
        this.carregando = false;
      },
    });
  }

  viewDetails(alimento: Cardapio): void {
    // Alguns itens de AlimentoOptions (db.json) usam "codigo" no lugar de "id".
    const id = alimento.id ?? (alimento as Cardapio & { codigo?: number }).codigo;
    if (id !== undefined) {
      this.router.navigate(['/marmita', id]);
    }
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
