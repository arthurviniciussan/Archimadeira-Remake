export interface ItemPedido {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque: number;
  imagem: string;
}

export interface NovoPedido {
  usuarioId: number;
  usuarioEmail: string | null;
  data: string;
  produtos: ItemPedido[];
  total: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  usuarioEmail: string | null;
  data: string;
  produtos: ItemPedido[];
  total: number;
}
