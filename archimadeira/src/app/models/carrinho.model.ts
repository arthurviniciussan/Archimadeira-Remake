export interface ItemCarrinho {
  produtoId: number;
  quantidade: number;
}

export interface Carrinho {
  id: number | string;
  usuarioId: number | string;
  itens: ItemCarrinho[];
}

export type NovoCarrinho = Omit<Carrinho, 'id'>;
