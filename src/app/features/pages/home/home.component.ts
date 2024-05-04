import { Component, OnInit, ViewChild } from '@angular/core';
import { Column } from '../../../core/models/column';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardapioService } from '../../../shared/services/cardapio.service';
import { Cardapio } from '../../../core/models/cardapio.model';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  public currentDate = new Date();
  public cols: Column[] = [];
  public productDialog: boolean = false;
  public alimentosCardapio!: Cardapio[];
  public alimentoCardapio!: Cardapio;
  public selectedAlimentosCardapio!: Cardapio[] | null;
  public submitted: boolean = false;
  public statuses!: any[];
  public Delete: string = '';

  constructor(
    private cardapioService: CardapioService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  public ngOnInit() {
    // this.cardapioService.getCardapio().then((data) => (this.alimentosCardapio = data));

    this.alimentosCardapio = [
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
        details: [this.alimentosCardapio[0], this.alimentosCardapio[1]],
      },
      {
        field: 'janta',
        header: 'Janta',
        details: [this.alimentosCardapio[2], this.alimentosCardapio[3]],
      },
    ];
  }

  public openNew() {
    this.alimentoCardapio = new Cardapio();
    this.submitted = false;
    this.productDialog = true;
  }

  public editAlimentoCardapio(alimentoCardapio: Cardapio) {
    this.alimentoCardapio = { ...alimentoCardapio };
    this.productDialog = true;
  }

  public deleteAlimentoCardapio(alimentoCardapio: Cardapio) {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir ' +
        alimentoCardapio.nome_alimento +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.alimentosCardapio = this.alimentosCardapio.filter(
          (val) => val.id !== alimentoCardapio.id
        );
        this.alimentoCardapio = new Cardapio();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Alimento excluido',
          life: 3000,
        });
      },
    });
  }

  public hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  public saveAlimentoCardapio() {
    this.submitted = true;

    if (this.alimentoCardapio.nome_alimento?.trim()) {
      if (this.alimentoCardapio.id) {
        this.alimentosCardapio[this.findIndexById(this.alimentoCardapio.id)] =
          this.alimentoCardapio;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        this.alimentoCardapio.id = this.createId();
        this.alimentosCardapio.push(this.alimentoCardapio);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      this.alimentosCardapio = [...this.alimentosCardapio];
      this.productDialog = false;
      this.alimentoCardapio = new Cardapio();
    }
  }

  public findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.alimentosCardapio.length; i++) {
      if (this.alimentosCardapio[i].id === id) {
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
