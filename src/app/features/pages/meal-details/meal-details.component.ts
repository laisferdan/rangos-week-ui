import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MarmitaDetalhe } from '../../../core/models/marmita-detalhe.model';
import { MarmitaService } from '../../../shared/services/marmita.service';

interface LinhaNutricional {
  nutriente: string;
  valor: string;
}

@Component({
  selector: 'app-meal-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  templateUrl: './meal-details.component.html',
  styleUrls: ['./meal-details.component.css'],
})
export class MealDetailsComponent {
  readonly vazio = '—';
  marmita: MarmitaDetalhe | undefined;
  linhasNutricionais: LinhaNutricional[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marmitaService: MarmitaService
  ) {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return Number.isInteger(id)
            ? this.marmitaService.getById(id)
            : of(undefined);
        }),
        takeUntilDestroyed()
      )
      .subscribe((marmita) => {
        this.marmita = marmita;
        this.linhasNutricionais = marmita ? this.montarLinhas(marmita) : [];
      });
  }

  voltar(): void {
    this.router.navigate(['/recommendations']);
  }

  /** Texto do campo, ou "—" quando nulo/vazio. */
  texto(valor: string | null | undefined): string {
    return valor ? valor : this.vazio;
  }

  private montarLinhas(marmita: MarmitaDetalhe): LinhaNutricional[] {
    const info = marmita.informacaoNutricional;
    return [
      { nutriente: 'Valor energético', valor: this.numero(info.valorEnergeticoKcal, 'kcal') },
      { nutriente: 'Proteínas', valor: this.numero(info.proteinasG, 'g') },
      { nutriente: 'Carboidratos', valor: this.numero(info.carboidratosG, 'g') },
      { nutriente: 'Gorduras', valor: this.numero(info.gordurasG, 'g') },
      { nutriente: 'Açúcares', valor: this.numero(info.acucaresG, 'g') },
      { nutriente: 'Sódio', valor: this.numero(info.sodioMg, 'mg') },
    ];
  }

  private numero(valor: number | null, unidade: string): string {
    return valor === null || valor === undefined
      ? this.vazio
      : `${valor} ${unidade}`;
  }
}
