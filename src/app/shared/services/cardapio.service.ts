import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cardapio } from '../../core/models/cardapio.model';

@Injectable({
  providedIn: 'root'
})
export class CardapioService {

  constructor(private _httpClient: HttpClient) { }

  private url = "http://localhost:3000/Alimentos";

  public getCardapio() : Observable<Cardapio[]> {
    return this._httpClient.get<Cardapio[]>(`${this.url}`)
  }

  
}
