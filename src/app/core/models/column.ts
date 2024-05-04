import { Cardapio } from "./cardapio.model";

export interface Column {
    field: string;
    header: string;
    details: Cardapio[];
}
