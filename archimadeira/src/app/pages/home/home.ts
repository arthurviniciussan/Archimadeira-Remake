import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Produto } from '../../models/produto.model';
import { ItemCarrinho, NovoItemCarrinho } from '../../models/item-carrinho.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { ProdutosService } from '../../services/produtos.services';

interface ProdutoVitrine extends Produto {
  desconto?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  produtosService = inject(ProdutosService);
  carrinhoService = inject(CarrinhoService);

  erro = '';
  mensagem = '';

  categorias = [
    { nome: 'Salas & Sofás', detalhe: 'Mais de 140 modelos', imagem: '/assets/images/sofa2lugares.jpeg' },
    { nome: 'Quartos & Camas', detalhe: 'Camas box e maciças', imagem: '/assets/images/camaNogueira.jpg' },
    { nome: 'Cozinha & Jantar', detalhe: 'Mesas, cadeiras e aparadores', imagem: '/assets/images/mesa.jpg' },
    { nome: 'Escritório', detalhe: 'Mesas e estantes de trabalho', imagem: '/assets/images/escritorio.avif' }
  ];

  produtos: ProdutoVitrine[] = [];

  descontosPorNome: Record<string, string> = {
    'Sofá 3 Lugares Retrátil e Reclinável': '10% OFF',
    'Sofá Retrátil Aramis 2 lugares - 2,90m': '8% OFF',
    'Cama de Casal Madeira Maciça': 'MADEIRA NOBRE',
    'Mesa de jantar redonda 6 lugares': '30% OFF',
  };

  ngOnInit(): void {
    this.produtosService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos.map((produto) => {
          const desconto = this.descontosPorNome[produto.nome];
          return {
            ...produto,
            ...(desconto ? { desconto } : {}),
          };
        });
        this.erro = '';
      },
      error: () => {
        this.erro = 'Não foi possível carregar os produtos. Verifique se o JSON Server está em execução.';
      },
    });
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.erro = '';
    this.mensagem = '';

    if (produto.estoque < 1) {
      this.erro = 'Produto sem estoque.';
      return;
    }

    const novoItem: NovoItemCarrinho = {
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      estoque: produto.estoque,
      imagem: produto.imagem,
    };

    this.carrinhoService.listar().subscribe({
      next: (itens) => {
        const existente = itens.find((item) => item.produtoId === produto.id);
        if (existente && existente.quantidade >= produto.estoque) {
          this.erro = `Só temos ${produto.estoque} unidades em estoque.`;
          return;
        }

        const requisicao = existente
          ? this.carrinhoService.alterar({
            ...existente,
            quantidade: existente.quantidade + 1,
            estoque: produto.estoque,
            preco: produto.preco,
            imagem: produto.imagem,
          })
          : this.carrinhoService.incluir(novoItem);

        this.finalizarAdicao(requisicao);
      },
      error: () => {
        this.erro = 'Não foi possível consultar o carrinho. Verifique se o JSON Server está em execução.';
      },
    });
  }

  private finalizarAdicao(requisicao: Observable<ItemCarrinho>): void {
    requisicao.subscribe({
      next: (item) => {
        this.mensagem = `${item.nome} foi adicionado ao carrinho.`;
      },
      error: () => {
        this.erro = 'Não foi possível adicionar o produto ao carrinho. Tente novamente.';
      },
    });
  }
}