export interface ItemCarrinho {
  produtoId: number;
  quantidade: number;
}

export interface Carrinho {
  id: number;
  usuarioId: number;
  itens: ItemCarrinho[];
}
