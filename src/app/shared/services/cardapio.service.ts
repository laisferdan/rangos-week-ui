import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cardapio } from '../../core/models/cardapio.model';

@Injectable({
  providedIn: 'root'
})
export class CardapioService {

  // constructor(private _httpClient: HttpClient) { }

  // private url = "http://127.0.0.1:8000/Alimentos/";

  // public getCardapio() : Observable<any[]> {
  //   return this._httpClient.get<any[]>(`${this.url}`)
  // }

  //public getCardapio(): {}
}
