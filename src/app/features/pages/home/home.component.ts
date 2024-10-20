import { Component, OnInit } from '@angular/core';
import { Column } from '../../../core/models/column';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardapioService } from '../../../shared/services/cardapio.service';
import { Cardapio } from '../../../core/models/cardapio.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  public currentDate = new Date();
  public cols: Column[] = [];
  public cardapioDialog: boolean = false;
  public cardapios!: Cardapio[];
  public cardapio!: Cardapio;
  public selectedCardapios!: Cardapio[] | null;
  public selectedAlimento!: string;
  public submitted: boolean = false;
  public alimentoOptions: Cardapio[] = [];
  public refeicoes = ['Café da manhã', 'Almoço', 'Jantar'];
  public diasSemana = [ 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo' ];
  public totalKcal: number = 0;

  constructor(
    private cardapioService: CardapioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit() {
    this.cardapioService.getCardapio().subscribe({
      next: (val) => {
        this.cardapios = val;

        this.cols = [
          {
            field: 'cafe',
            header: 'Café da manhã',
            details: [],
            totalKcal: 0
          },
          {
            field: 'almoco',
            header: 'Almoço',
            details: [],
            totalKcal: 0
          },
          {
            field: 'Jantar',
            header: 'Jantar',
            details: [],
            totalKcal: 0
          },
        ];

        this.cardapios.forEach((cardapio) => {
          this.checkNomeRefeicao(cardapio);
        });

        this.cols.forEach((col) => {
          col.totalKcal = this.calculateTotalKcal(col.details);
        });

        this.totalKcal = this.cols.reduce((sum, col) => sum + col.totalKcal, 0);
      },
      error: (e) => {
        console.log(e);
      },
    });

    this.cardapioService.getAlimentoOptions().subscribe({
      next: (val) => {
        this.alimentoOptions = val;
        this.alimentoOptions = val.sort((a, b) =>
          a.nome_alimento.localeCompare(b.nome_alimento)
        );
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  private checkNomeRefeicao(cardapio: Cardapio) {
    if (cardapio.nome_refeicao === 'Café da manhã' ||
      cardapio.nome_refeicao === 'Cafe'
    ) {
      this.cols[0].details.push(cardapio);
    } else if (cardapio.nome_refeicao === 'Almoco' ||
      cardapio.nome_refeicao === 'Almoço'
    ) {
      this.cols[1].details.push(cardapio);
    } else if (cardapio.nome_refeicao === 'Jantar') {
      this.cols[2].details.push(cardapio);
    }
  }

  private calculateTotalKcal(details: Cardapio[]): number {
    return details.reduce((sum, detail) => sum + detail.kcal, 0);
  }

  public openNew() {
    this.cardapio = new Cardapio();
    this.submitted = false;
    this.cardapioDialog = true;
  }

  public editAlimentoCardapio(alimentoCardapio: Cardapio) {
    this.cardapio = { ...alimentoCardapio };
    this.cardapioDialog = true;
  }

  public deleteAlimentoCardapio(alimentoCardapio: Cardapio) {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir ' +
        alimentoCardapio.nome_alimento +
        '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.cols.forEach((col) => {
          col.details = col.details.filter(
            (val) => val.id !== alimentoCardapio.id
          );
        });

        this.cardapio = new Cardapio();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Alimento excluído',
          life: 3000,
        });

        this.cols.forEach((col) => {
          col.totalKcal = this.calculateTotalKcal(col.details);
        });

        this.totalKcal = this.cols.reduce((sum, col) => sum + col.totalKcal, 0);
      },
    });
  }

  public hideDialog() {
    this.cardapioDialog = false;
    this.submitted = false;
  }

  public saveAlimentoCardapio() {
    this.submitted = true;
    if (
      this.cardapio.nome_alimento &&
      this.cardapio.nome_refeicao &&
      this.cardapio.nome_alimento &&
      this.cardapio.nome_categoria &&
      this.cardapio.quantidade &&
      this.cardapio.kcal &&
      this.cardapio.dia_semana
    ) {

      if (this.cardapio.id) {
        this.cardapioService.updateCardapio(this.cardapio).subscribe({
          next: () => {
            const index = this.findIndexById(this.cardapio.id);
            this.cardapios[index] = this.cardapio;
            this.updateCols();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Alimento atualizado',
              life: 3000,
            });
            this.onAlimentoChange({ value: this.selectedAlimento });
          },
          error: (e) => {
            console.log(e);
          },
        });
      } else {
        this.cardapio.id = this.createId();
        this.cardapioService.updateCardapio(this.cardapio).subscribe({
          next: () => {
            this.cardapios.push(this.cardapio);
            this.updateCols();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Alimento adicionado',
              life: 3000,
            });
            this.onAlimentoChange({ value: this.selectedAlimento });
          },
          error: (e) => {
            console.log(e);
          },
        });
      }

      this.cardapioDialog = false;
      this.cardapio = new Cardapio();
      window.location.reload();
    }
  }

  public findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.cardapios.length; i++) {
      if (this.cardapios[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  public createId(): number {
    let id = 0;
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id = id * 10 + chars.charCodeAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  private updateCols() {
    this.cols.forEach(col => col.details = []);
    this.cardapios.forEach((cardapio) => {
      this.checkNomeRefeicao(cardapio);
    });

    this.cols.forEach((col) => {
      col.totalKcal = this.calculateTotalKcal(col.details);
    });
  }

  public onAlimentoChange(event: any) {
    const selectedAlimento = event.value;
    if (selectedAlimento) {
      this.cardapio.nome_alimento = selectedAlimento.nome_alimento;
      this.cardapio.nome_refeicao = selectedAlimento.nome_refeicao;
      this.cardapio.nome_categoria = selectedAlimento.nome_categoria;
      this.cardapio.quantidade = selectedAlimento.quantidade;
      this.cardapio.kcal = selectedAlimento.kcal;
      this.cardapio.dia_semana = selectedAlimento.dia_semana;
    }
  }
}