import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmazenamentoComponent } from './armazenamento.component';

describe('ArmazenamentoComponent', () => {
  let component: ArmazenamentoComponent;
  let fixture: ComponentFixture<ArmazenamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArmazenamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArmazenamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
