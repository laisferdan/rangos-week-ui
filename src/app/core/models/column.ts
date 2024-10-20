import { Cardapio } from "./cardapio.model";

export interface Column {
    totalKcal: number;
    field: string;
    header: string;
    details: Cardapio[];
}
