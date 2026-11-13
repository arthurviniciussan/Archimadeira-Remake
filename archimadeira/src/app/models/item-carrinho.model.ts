export interface ItemCarrinho {
  id: number;
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque: number;
  imagem: string;
}

export interface NovoItemCarrinho {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  estoque: number;
  imagem: string;
}