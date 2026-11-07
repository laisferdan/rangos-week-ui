export interface InformacaoNutricional {
  valorEnergeticoKcal: number | null;
  proteinasG: number | null;
  carboidratosG: number | null;
  gordurasG: number | null;
  acucaresG: number | null;
  sodioMg: number | null;
}

export interface IngredienteMarmita {
  nome: string;
  quantidade: string | null;
}

export interface CongelamentoMarmita {
  comoArmazenar: string | null;
  validadeCongelado: string | null;
}

export interface AquecimentoMarmita {
  metodo: string | null;
  tempo: string | null;
}

export interface MarmitaDetalhe {
  /** Mesmo id do prato em AlimentoOptions (db.json). */
  id: number;
  nome: string;
  tipoRefeicao: string | null;
  informacaoNutricional: InformacaoNutricional;
  ingredientes: IngredienteMarmita[];
  modoPreparo: string[];
  congelamento: CongelamentoMarmita;
  aquecimento: AquecimentoMarmita;
}
