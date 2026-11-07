import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Cardapio } from '../../core/models/cardapio.model';
import { CardapioService } from './cardapio.service';

describe('CardapioService', () => {
  let service: CardapioService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CardapioService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const record = {
    id: 7,
    data: '2026-11-07',
    tipo_refeicao: 'almoço',
    recipe_id: 1,
    quantidade_g: 250,
    kcal: 300,
    nome_alimento: 'Abobrinha Recheada',
    nome_categoria: 'Pratos Únicos',
  };

  function cardapio(overrides: Partial<Cardapio> = {}): Cardapio {
    return {
      id: undefined as unknown as number,
      recipe_id: 1,
      nome_refeicao: 'Almoço',
      nome_alimento: 'Abobrinha Recheada',
      nome_categoria: 'Pratos Únicos',
      quantidade: 250,
      kcal: 300,
      dia_semana: 'Sábado',
      data: '2026-11-07',
      ...overrides,
    };
  }

  it('getAlimentoOptions busca /recipes e converte a quantidade em número', () => {
    let result: Cardapio[] = [];

    service.getAlimentoOptions().subscribe((r) => (result = r));

    const req = http.expectOne('/api/recipes');
    expect(req.request.method).toBe('GET');
    req.flush({
      recipes: [
        {
          id: 11,
          nome_refeicao: 'Café da manhã',
          nome_alimento: 'Café',
          nome_categoria: 'Bebidas',
          quantidade: '10g',
          kcal: 35.3,
          dia_semana: 'Domingo',
        },
      ],
    });

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(11);
    expect(result[0].quantidade).toBe(10);
    expect(result[0].kcal).toBe(35.3);
  });

  it('getCardapiosByDate busca /records?date=AAAA-MM-DD (data local)', () => {
    let result: Cardapio[] = [];

    service.getCardapiosByDate(new Date(2026, 10, 7, 23, 30)).subscribe(
      (r) => (result = r)
    );

    const req = http.expectOne((r) => r.url === '/api/records');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('date')).toBe('2026-11-07');
    req.flush({ records: [record] });

    expect(result[0]).toEqual(
      jasmine.objectContaining({
        id: 7,
        recipe_id: 1,
        nome_refeicao: 'Almoço',
        nome_alimento: 'Abobrinha Recheada',
        quantidade: 250,
        kcal: 300,
        dia_semana: 'Sábado',
        data: '2026-11-07',
      })
    );
  });

  it('traduz os tipos de refeição da API para os rótulos da tela', () => {
    let result: Cardapio[] = [];
    service.getCardapiosByDate(new Date(2026, 10, 7)).subscribe(
      (r) => (result = r)
    );

    http.expectOne((r) => r.url === '/api/records').flush({
      records: [
        { ...record, id: 1, tipo_refeicao: 'cafe_da_manha' },
        { ...record, id: 2, tipo_refeicao: 'jantar' },
      ],
    });

    expect(result.map((c) => c.nome_refeicao)).toEqual([
      'Café da manhã',
      'Jantar',
    ]);
  });

  it('saveCardapio sem id faz POST /records', () => {
    let saved: Cardapio | undefined;

    service.saveCardapio(cardapio()).subscribe((c) => (saved = c));

    const req = http.expectOne('/api/records');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      data: '2026-11-07',
      tipo_refeicao: 'almoço',
      recipe_id: 1,
      quantidade_g: 250,
    });
    req.flush(record);
    expect(saved?.id).toBe(7);
  });

  it('saveCardapio com id faz PUT /records/{id}', () => {
    service
      .saveCardapio(cardapio({ id: 7, nome_refeicao: 'Café da manhã' }))
      .subscribe();

    const req = http.expectOne('/api/records/7');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.tipo_refeicao).toBe('cafe_da_manha');
    req.flush({ ...record, tipo_refeicao: 'cafe_da_manha' });
  });

  it('saveCardapio sem recipe_id falha sem chamar a API', () => {
    let message = '';

    service
      .saveCardapio(cardapio({ recipe_id: undefined }))
      .subscribe({ error: (e: Error) => (message = e.message) });

    http.expectNone('/api/records');
    expect(message).toContain('alimento');
  });

  it('deleteCardapio faz DELETE /records/{id}', () => {
    let done = false;

    service.deleteCardapio('7').subscribe(() => (done = true));

    const req = http.expectOne('/api/records/7');
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Record deleted' });
    expect(done).toBeTrue();
  });

  it('propaga erros HTTP para o chamador', () => {
    let status = 0;

    service.getAlimentoOptions().subscribe({ error: (e) => (status = e.status) });

    http
      .expectOne('/api/recipes')
      .flush({}, { status: 500, statusText: 'Server Error' });
    expect(status).toBe(500);
  });
});
