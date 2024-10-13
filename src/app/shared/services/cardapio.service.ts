import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cardapio } from '../../core/models/cardapio.model';

@Injectable({
  providedIn: 'root',
})
export class CardapioService {
  constructor(private _httpClient: HttpClient) {}

  private urlAlimentos = 'http://localhost:3000/Alimentos';
  private urlAlimentoOptions = 'http://localhost:3000/AlimentoOptions';

  public getCardapio(): Observable<Cardapio[]> {
    return this._httpClient.get<Cardapio[]>(`${this.urlAlimentos}`);
  }

  public updateCardapio(data: Cardapio): Observable<Cardapio[]> {
    return this._httpClient.post<Cardapio[]>(`${this.urlAlimentos}`, data);
  }

  public getAlimentoOptions(): Observable<Cardapio[]> {
    return this._httpClient.get<Cardapio[]>(`${this.urlAlimentoOptions}`);
  }
}
