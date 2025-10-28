import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Column } from '../../../core/models/column';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardapioService } from '../../../shared/services/cardapio.service';
import { Cardapio } from '../../../core/models/cardapio.model';
import { AuthService } from '../../../shared/services/auth.service';
import { CapitalizeFirstLetterPipe } from '../../../shared/pipes/capitalize-first-letter.pipe';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    TableModule,
    ToastModule,
    CapitalizeFirstLetterPipe,
    ConfirmDialogModule,
    InputTextModule,
    RippleModule,
    TooltipModule,
    CalendarModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  public currentDate = new Date();
  public selectedDate = new Date();
  public isCurrentDate: boolean = true;
  public cols: Column[] = [];
  public cardapioDialog: boolean = false;
  public cardapios!: Cardapio[];
  public cardapio: Cardapio = new Cardapio();
  public selectedCardapios!: Cardapio[] | null;
  public selectedAlimento!: any;
  public submitted: boolean = false;
  public alimentoOptions: Cardapio[] = [];
  public refeicoes = ['Café da manhã', 'Almoço', 'Jantar'];
  public diasSemana = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];
  public totalKcal: number = 0;
  public isLoggedIn: boolean = true;

  constructor(
    private cardapioService: CardapioService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  public ngOnInit() {
    this.initializeCols();
    this.initializeData();
    this.loadAlimentoOptions();
  }

  private initializeCols() {
    this.cols = [
      {
        field: 'cafe',
        header: 'Café da manhã',
        details: [],
        totalKcal: 0,
      },
      {
        field: 'almoco',
        header: 'Almoço',
        details: [],
        totalKcal: 0,
      },
      {
        field: 'jantar',
        header: 'Jantar',
        details: [],
        totalKcal: 0,
      },
    ];
  }

  private initializeData() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.updateCardapiosByDate();
  }

  private updateCardapiosByDate() {
    // Clear existing details
    this.cols.forEach((col) => (col.details = []));

    this.cardapioService.getCardapiosByDate(this.selectedDate).subscribe({
      next: (cardapios) => {
        this.cardapios = cardapios;
        cardapios.forEach((cardapio) => {
          this.distributeCardapioToMeal(cardapio);
        });
        this.updateMealTotals();
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar cardápio',
          life: 3000,
        });
        console.error(e);
      },
    });
  }

  private distributeCardapioToMeal(cardapio: Cardapio) {
    const mealMap: { [key: string]: number } = {
      'Café da manhã': 0,
      Cafe: 0,
      Almoço: 1,
      Almoco: 1,
      Jantar: 2,
    };

    const index = mealMap[cardapio.nome_refeicao];
    if (index !== undefined) {
      this.cols[index].details.push(cardapio);
    }
  }

  private updateMealTotals() {
    this.cols.forEach((col) => {
      col.totalKcal = this.calculateTotalKcal(col.details);
    });
    this.totalKcal = this.cols.reduce((sum, col) => sum + col.totalKcal, 0);
  }

  private calculateTotalKcal(details: Cardapio[]): number {
    return details.reduce((sum, detail) => sum + detail.kcal, 0);
  }

  private loadAlimentoOptions() {
    this.cardapioService.getAlimentoOptions().subscribe({
      next: (val) => {
        this.alimentoOptions = val.sort((a, b) =>
          a.nome_alimento.localeCompare(b.nome_alimento)
        );
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar opções de alimentos',
          life: 3000,
        });
        console.error(e);
      },
    });
  }

  private updateIsCurrentDate() {
    const current = new Date();
    const selected = new Date(this.selectedDate);

    this.isCurrentDate =
      current.getDate() === selected.getDate() &&
      current.getMonth() === selected.getMonth() &&
      current.getFullYear() === selected.getFullYear();
  }

  public onDateSelect() {
    this.updateIsCurrentDate();
    this.updateCardapiosByDate();
  }

  changeDate(direction: 'prev' | 'next') {
    const currentDate = new Date(this.selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.selectedDate = currentDate;
    this.updateIsCurrentDate();
    this.updateCardapiosByDate();
  }

  public openNew() {
    this.cardapio = new Cardapio();
    const weekdays = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    this.cardapio.dia_semana = weekdays[this.selectedDate.getDay()];
    this.submitted = false;
    this.cardapioDialog = true;
  }

  public editAlimentoCardapio(cardapio: Cardapio) {
    this.cardapio = { ...cardapio };
    this.selectedAlimento = { ...cardapio };
    this.cardapioDialog = true;
  }

  public deleteAlimentoCardapio(cardapio: Cardapio) {
    if (cardapio.id) {
      this.cardapioService.deleteCardapio(cardapio.id.toString()).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cardápio excluído',
            life: 3000,
          });
          this.updateCardapiosByDate();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao excluir cardápio',
            life: 3000,
          });
          console.error(e);
        },
      });
    }
  }

  public hideDialog() {
    this.cardapioDialog = false;
    this.submitted = false;
    this.selectedAlimento = null;
  }

  public onAlimentoChange(event: any) {
    if (event.value) {
      this.cardapio.nome_alimento = event.value.nome_alimento;
      this.cardapio.nome_categoria = event.value.nome_categoria;
      // Parse quantidade to extract numeric value, removing 'g' unit
      const quantidadeStr = event.value.quantidade.toString().replace('g', '');
      this.cardapio.quantidade = parseInt(quantidadeStr);
      this.cardapio.kcal = event.value.kcal;
    } else {
      this.cardapio.nome_alimento = '';
      this.cardapio.nome_categoria = '';
      this.cardapio.quantidade = 0;
      this.cardapio.kcal = 0;
    }
  }

  public saveAlimentoCardapio() {
    this.submitted = true;

    if (!this.cardapio.nome_alimento || !this.cardapio.nome_refeicao) {
      return;
    }

    const selectedDate = new Date(this.selectedDate);
    const weekdays = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    this.cardapio.dia_semana = weekdays[selectedDate.getDay()];

    if (this.cardapio.id) {
      this.cardapioService.saveCardapio(this.cardapio).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cardápio atualizado',
            life: 3000,
          });
          this.updateCardapiosByDate();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar cardápio',
            life: 3000,
          });
          console.error(e);
        },
      });
    } else {
      this.cardapioService.saveCardapio(this.cardapio).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cardápio criado',
            life: 3000,
          });
          this.updateCardapiosByDate();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar cardápio',
            life: 3000,
          });
          console.error(e);
        },
      });
    }

    this.cardapioDialog = false;
    this.cardapio = new Cardapio();
  }
}
