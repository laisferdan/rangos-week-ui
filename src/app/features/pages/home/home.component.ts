import { Component, OnInit } from '@angular/core';
import { Column } from '../../../core/models/column';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardapioService } from '../../../shared/services/cardapio.service';
import { Cardapio } from '../../../core/models/cardapio.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  public currentDate = new Date();
  public cols: Column[] = [];
  public cardapioDialog: boolean = false;
  public cardapios!: Cardapio[];
  public cardapio!: Cardapio;
  public selectedCardapios!: Cardapio[] | null;
  public selectedAlimento!: string | null;
  public submitted: boolean = false;
  public obj: any;
  constructor(
    private cardapioService: CardapioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit() {
  //   this.cardapioService.getCardapio().subscribe({
  //     next: val => {
  //       this.obj = val;
  //     },
  //     error: e => {
  //       console.log(e);
  //     }
  //   });

    this.cardapios = [
      {
        id: 1,
            nome_refeicao: 'Almoco',
            nome_alimento: 'Acelga Crua (picada)',
            nome_categoria: 'Vegetais cru',
            quantidade: '9 col. sopa',
            kcal: 15,
            dia_semana: 'Sábado'
      },
      {
        id: 2,
        nome_refeicao: 'Almoco',
        nome_alimento: 'Cogumelo Champignon',
        nome_categoria: 'Conservas',
        quantidade: '9 un.',
        kcal: 15,
        dia_semana: 'Sábado',
      },
      {
        id: 3,
        nome_refeicao: 'Janta',
        nome_alimento: 'Cenoura em Fatias',
        nome_categoria: 'Vegetais cozidos',
        quantidade: '7 fatias',
        kcal: 15,
        dia_semana: 'Sábado',
      },
      {
        id: 4,
        nome_refeicao: 'Janta',
        nome_alimento: 'Alface Americana',
        nome_categoria: 'Vegetais cru',
        quantidade: '1 ½ xíc. chá',
        kcal: 15,
        dia_semana: 'Sábado',
      }
    ];

    this.cols = [
      {
        field: 'almoco',
        header: 'Almoço',
        details: [this.cardapios[0], this.cardapios[1]],
      },
      {
        field: 'janta',
        header: 'Janta',
        details: [this.cardapios[2], this.cardapios[3]],
      },
    ];
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
        this.cardapios = this.cardapios.filter(
          (val) => val.id !== alimentoCardapio.id
        );
        this.cardapio = new Cardapio();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Alimento excluído',
          life: 3000,
        });
      },
    });
  }

  public hideDialog() {
    this.cardapioDialog = false;
    this.submitted = false;
  }

  public saveAlimentoCardapio() {
    this.submitted = true;

    if (this.cardapio.nome_alimento?.trim()) {
      if (this.cardapio.id) {
        this.cardapios[this.findIndexById(this.cardapio.id)] =
          this.cardapio;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Alimento atualizado',
          life: 3000,
        });
      } else {
        this.cardapio.id = this.createId();
        this.cardapios.push(this.cardapio);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Alimento adicionado',
          life: 3000,
        });
      }

      this.cardapios = [...this.cardapios];
      this.cardapioDialog = false;
      this.cardapio = new Cardapio();
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
}
