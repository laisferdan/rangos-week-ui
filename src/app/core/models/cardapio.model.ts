export class Cardapio {
    public id!: number;
    public nome_refeicao!: string;
    public nome_alimento!: string;
    public nome_categoria!: string;
    public quantidade!: number;
    public kcal!: number;
    public dia_semana!: string;
    /** Id do prato (/recipes) ao qual o registro se refere. */
    public recipe_id?: number;
    /** Data do registro no formato AAAA-MM-DD (data local). */
    public data?: string;
}
