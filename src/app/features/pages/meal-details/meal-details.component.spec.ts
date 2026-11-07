import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { MealDetailsComponent } from './meal-details.component';
import { MarmitaService } from '../../../shared/services/marmita.service';
import { MarmitaDetalhe } from '../../../core/models/marmita-detalhe.model';

const marmitaCompleta: MarmitaDetalhe = {
  id: 1,
  nome: 'Abobrinha Recheada',
  tipoRefeicao: 'Almoço',
  informacaoNutricional: {
    valorEnergeticoKcal: 300,
    proteinasG: 20,
    carboidratosG: 30,
    gordurasG: 10,
    acucaresG: 5,
    sodioMg: 400,
  },
  ingredientes: [{ nome: 'Abobrinha', quantidade: '200 g' }],
  modoPreparo: ['Cozinhe a abobrinha.', 'Recheie e leve ao forno.'],
  congelamento: { comoArmazenar: 'Pote fechado', validadeCongelado: '30 dias' },
  aquecimento: { metodo: 'Micro-ondas', tempo: '3 minutos' },
};

const marmitaSemDados: MarmitaDetalhe = {
  id: 2,
  nome: 'Lasanha Berinjela',
  tipoRefeicao: null,
  informacaoNutricional: {
    valorEnergeticoKcal: 300,
    proteinasG: null,
    carboidratosG: null,
    gordurasG: null,
    acucaresG: null,
    sodioMg: null,
  },
  ingredientes: [],
  modoPreparo: [],
  congelamento: { comoArmazenar: null, validadeCongelado: null },
  aquecimento: { metodo: null, tempo: null },
};

describe('MealDetailsComponent', () => {
  let fixture: ComponentFixture<MealDetailsComponent>;
  let router: jasmine.SpyObj<Router>;

  function criar(id: string, marmita: MarmitaDetalhe | undefined): HTMLElement {
    const marmitaService = jasmine.createSpyObj<MarmitaService>('MarmitaService', [
      'getById',
    ]);
    marmitaService.getById.and.returnValue(of(marmita));
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [MealDetailsComponent],
      providers: [
        { provide: MarmitaService, useValue: marmitaService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id })) },
        },
      ],
    });

    fixture = TestBed.createComponent(MealDetailsComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renderiza os blocos quando a marmita existe', () => {
    const el = criar('1', marmitaCompleta);

    expect(el.querySelector('h1')?.textContent).toContain('Abobrinha Recheada');
    expect(el.textContent).toContain('Almoço');

    const titulosH2 = Array.from(el.querySelectorAll('h2')).map((h) =>
      h.textContent?.trim()
    );
    expect(titulosH2).toEqual([
      'Tabela nutricional',
      'Ingredientes',
      'Modo de preparo',
      'Congelamento e aquecimento',
    ]);

    expect(el.querySelectorAll('section[aria-labelledby]').length).toBe(5);
    expect(el.querySelector('p-table')).not.toBeNull();
    expect(el.textContent).toContain('300 kcal');
    expect(el.querySelectorAll('ul li').length).toBe(1);
    expect(el.querySelectorAll('ol li').length).toBe(2);
    expect(el.textContent).toContain('Micro-ondas');
    expect(el.textContent).toContain('30 dias');
    expect(el.textContent).not.toContain('Marmita não encontrada');
  });

  it('mostra "Marmita não encontrada" quando a marmita não existe', () => {
    const el = criar('999', undefined);

    expect(el.querySelector('h1')?.textContent).toContain('Marmita não encontrada');
    expect(el.querySelector('p-table')).toBeNull();
    expect(el.querySelector('button')?.textContent).toContain('Voltar');
  });

  it('mostra "—" para campos nulos', () => {
    const el = criar('2', marmitaSemDados);

    const celulas = Array.from(el.querySelectorAll('p-table td')).map((td) =>
      td.textContent?.trim()
    );
    // 5 nutrientes nulos na tabela + tipo de refeição + 4 campos de armazenamento/aquecimento
    expect(celulas.filter((c) => c === '—').length).toBe(5);
    expect(el.querySelectorAll('dd').length).toBe(4);
    Array.from(el.querySelectorAll('dd')).forEach((dd) =>
      expect(dd.textContent?.trim()).toBe('—')
    );
    expect(el.querySelector('.tipo-refeicao')?.textContent).toContain('—');
  });

  it('o botão Voltar leva para /recommendations', () => {
    const el = criar('1', marmitaCompleta);

    (el.querySelector('button.btn-voltar') as HTMLButtonElement).click();

    expect(router.navigate).toHaveBeenCalledWith(['/recommendations']);
  });
});
