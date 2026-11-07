import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MarmitaDetalhe } from '../../core/models/marmita-detalhe.model';
import marmitasData from '../../../../json/marmitas-detalhes.json';

@Injectable({
  providedIn: 'root',
})
export class MarmitaService {
  private mockMarmitas: MarmitaDetalhe[] = marmitasData.Marmitas;

  getById(id: number): Observable<MarmitaDetalhe | undefined> {
    return of(this.mockMarmitas.find((marmita) => marmita.id === id));
  }
}
