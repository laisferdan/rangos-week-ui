import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cardapio } from '../../core/models/cardapio.model';
import * as dbData from '../../../../json/db.json';

@Injectable({
  providedIn: 'root'
})
export class CardapioService {
  private mockCardapios: Cardapio[] = [];
  private mockAlimentos: Cardapio[] = this.parseAlimentos((dbData as any).AlimentoOptions);
  private lastId = Math.max(...this.mockAlimentos.map(a => a.id || 0)) + 1;

  private parseAlimentos(alimentos: any[]): Cardapio[] {
    return alimentos.map(alimento => ({
      ...alimento,
      quantidade: parseInt(alimento.quantidade.toString().replace('g', '')),
    }));
  }

  getCardapiosByDate(date: Date): Observable<Cardapio[]> {
    return of(this.mockCardapios.filter(cardapio => {
      const cardapioDate = this.getDateFromDiaSemana(cardapio.dia_semana);
      return this.isSameDay(cardapioDate, date);
    }));
  }

  getCardapio(): Observable<Cardapio[]> {
    return of(this.mockCardapios);
  }

  getAlimentoOptions(): Observable<Cardapio[]> {
    return of(this.mockAlimentos);
  }

  saveCardapio(cardapio: Cardapio): Observable<Cardapio> {
    if (cardapio.id) {
      // Update existing cardapio
      const index = this.mockCardapios.findIndex(c => c.id === cardapio.id);
      if (index !== -1) {
        this.mockCardapios[index] = { ...cardapio };
        return of(this.mockCardapios[index]);
      }
    }
    
    // Create new cardapio
    const newCardapio = { ...cardapio, id: this.lastId++ };
    this.mockCardapios.push(newCardapio);
    return of(newCardapio);
  }

  deleteCardapio(id: string): Observable<void> {
    const index = this.mockCardapios.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
      this.mockCardapios.splice(index, 1);
    }
    return of(void 0);
  }

  private getDateFromDiaSemana(diaSemana: string): Date {
    const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const today = new Date();
    const currentDay = today.getDay();
    const targetDay = weekdays.indexOf(diaSemana);
    const diff = targetDay - currentDay;
    
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    return date;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
}