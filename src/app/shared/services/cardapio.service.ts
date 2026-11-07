import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { Cardapio } from '../../core/models/cardapio.model';
import { toIsoDate, weekdayFromIsoDate } from '../../core/utils/date.util';
import { environment } from '../../../environments/environment';

interface RecipeDto {
  id: number;
  nome_refeicao: string;
  nome_alimento: string;
  nome_categoria: string;
  quantidade: string;
  kcal: number;
  dia_semana: string;
}

interface RecordDto {
  id: number;
  data: string;
  tipo_refeicao: string;
  recipe_id: number;
  quantidade_g: number | null;
  kcal: number;
  nome_alimento: string;
  nome_categoria: string;
}

// Rótulo exibido na tela -> valor aceito pela API (/records).
const MEAL_TO_API: Record<string, string> = {
  'Café da manhã': 'cafe_da_manha',
  Cafe: 'cafe_da_manha',
  Almoço: 'almoço',
  Almoco: 'almoço',
  Jantar: 'jantar',
};

const MEAL_FROM_API: Record<string, string> = {
  cafe_da_manha: 'Café da manhã',
  almoço: 'Almoço',
  jantar: 'Jantar',
};

@Injectable({
  providedIn: 'root',
})
export class CardapioService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Pratos disponíveis (GET /recipes). */
  getAlimentoOptions(): Observable<Cardapio[]> {
    return this.http
      .get<{ recipes: RecipeDto[] }>(`${this.apiUrl}/recipes`)
      .pipe(map((response) => response.recipes.map((r) => this.fromRecipe(r))));
  }

  /** Registros do usuário em uma data (GET /records?date=). */
  getCardapiosByDate(date: Date): Observable<Cardapio[]> {
    const params = new HttpParams().set('date', toIsoDate(date));
    return this.http
      .get<{ records: RecordDto[] }>(`${this.apiUrl}/records`, { params })
      .pipe(map((response) => response.records.map((r) => this.fromRecord(r))));
  }

  /** Cria (POST) ou atualiza (PUT) um registro, conforme exista `id`. */
  saveCardapio(cardapio: Cardapio): Observable<Cardapio> {
    if (!cardapio.recipe_id) {
      return throwError(() => new Error('Selecione um alimento válido.'));
    }

    const body = {
      data: cardapio.data ?? toIsoDate(new Date()),
      tipo_refeicao: MEAL_TO_API[cardapio.nome_refeicao],
      recipe_id: cardapio.recipe_id,
      quantidade_g: cardapio.quantidade,
    };

    const request$ = cardapio.id
      ? this.http.put<RecordDto>(`${this.apiUrl}/records/${cardapio.id}`, body)
      : this.http.post<RecordDto>(`${this.apiUrl}/records`, body);

    return request$.pipe(map((record) => this.fromRecord(record)));
  }

  deleteCardapio(id: string): Observable<void> {
    return this.http
      .delete(`${this.apiUrl}/records/${id}`)
      .pipe(map(() => void 0));
  }

  private fromRecipe(recipe: RecipeDto): Cardapio {
    return {
      id: recipe.id,
      nome_refeicao: recipe.nome_refeicao,
      nome_alimento: recipe.nome_alimento,
      nome_categoria: recipe.nome_categoria,
      quantidade: parseFloat(recipe.quantidade.replace('g', '')),
      kcal: recipe.kcal,
      dia_semana: recipe.dia_semana,
    };
  }

  private fromRecord(record: RecordDto): Cardapio {
    return {
      id: record.id,
      recipe_id: record.recipe_id,
      nome_refeicao:
        MEAL_FROM_API[record.tipo_refeicao] ?? record.tipo_refeicao,
      nome_alimento: record.nome_alimento,
      nome_categoria: record.nome_categoria,
      quantidade: record.quantidade_g ?? 0,
      kcal: record.kcal,
      dia_semana: weekdayFromIsoDate(record.data),
      data: record.data,
    };
  }
}
