import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ItemCarrinho, NovoItemCarrinho } from '../../models/item-carrinho.model';
import { ItemPedido, NovoPedido } from '../../models/pedido.model';
import { Produto } from '../../models/produto.model';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.services';

@Component({
  selector: 'app-carrinho',
  imports: [CurrencyPipe],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class CarrinhoComponent implements OnInit {
  service = inject(CarrinhoService);
  produtosService = inject(ProdutosService);
  pedidosService = inject(PedidosService);
  authService = inject(AuthService);

  listaItens: ItemCarrinho[] = [];
  listaProdutos: Produto[] = [];
  erro = '';
  sucesso = '';
  finalizando = false;

  ngOnInit(): void {
    this.carregarItens();

    this.produtosService.listar().subscribe({
      next: (produtos) => {
        this.listaProdutos = produtos;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os produtos. Verifique se o JSON Server está em execução.';
      },
    });
  }
  
  carregarItens(limparErro = true): void {
    this.service.listar().subscribe({
      next: (itens) => {
        this.listaItens = itens;
        if (limparErro) {
          this.erro = '';
        }
      },
      error: () => {
        this.erro = 'Não foi possível carregar o carrinho. Verifique se o JSON Server está em execução.';
      },
    });
  }

  adicionar(produto: Produto): void {
    if (produto.estoque < 1) {
      this.erro = 'Produto sem estoque.';
      return;
    }

    this.erro = '';
    const novoItem: NovoItemCarrinho = {
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      estoque: produto.estoque,
      imagem: produto.imagem,
    };

    this.service.listar().subscribe({
      next: (itens) => {
        const existente = itens.find((item) => item.produtoId === produto.id);
        if (existente && existente.quantidade >= produto.estoque) {
          this.erro = `Só temos ${produto.estoque} unidades em estoque.`;
          return;
        }

        const requisicao = existente
          ? this.service.alterar({
            ...existente,
            quantidade: existente.quantidade + 1,
            estoque: produto.estoque,
            preco: produto.preco,
            imagem: produto.imagem,
          })
          : this.service.incluir(novoItem);

        requisicao.subscribe({
          next: () => this.carregarItens(),
          error: () => {
            this.erro = 'Não foi possível adicionar o produto ao carrinho. Tente novamente.';
          },
        });
      },
      error: () => {
        this.erro = 'Não foi possível consultar o carrinho. Verifique se o JSON Server está em execução.';
      },
    });
  }

  aumentar(item: ItemCarrinho): void {
    if (item.quantidade >= item.estoque) {
      this.erro = `Só temos ${item.estoque} unidades em estoque.`;
      return;
    }
    this.atualizarQuantidade(item, item.quantidade + 1);
  }

  diminuir(item: ItemCarrinho): void {
    if (item.quantidade <= 1) {
      this.erro = 'A quantidade mínima é 1. Para tirar o produto, use "Remover".';
      return;
    }
    this.atualizarQuantidade(item, item.quantidade - 1);
  }

  atualizarQuantidade(item: ItemCarrinho, quantidade: number): void {
    this.erro = '';
    this.service.alterar({ ...item, quantidade }).subscribe({
      next: (itemAlterado) => {
        this.listaItens = this.listaItens.map((itemAtual) =>
          itemAtual.id === itemAlterado.id ? itemAlterado : itemAtual,
        );
      },
      error: () => {
        this.erro = 'Não foi possível atualizar a quantidade. Tente novamente.';
      },
    });
  }

  remover(id: number): void {
    this.service.excluir(id).subscribe({
      next: () => {
        this.listaItens = this.listaItens.filter(item => item.id !== id);
      },
      error: () => {
        this.erro = 'Não foi possível remover o item do carrinho. Tente novamente.';
      },
    });
  }

  esvaziar(): void {
    const itensParaRemover = [...this.listaItens];
    this.erro = '';

    for (const item of itensParaRemover) {
      this.remover(item.id);
    }
  }

  finalizarCompra(): void {
    if (this.listaItens.length === 0 || this.finalizando) {
      return;
    }

    this.erro = '';
    this.sucesso = '';
    this.finalizando = true;

    const itensPedido: ItemPedido[] = this.listaItens.map((item) => ({
      produtoId: item.produtoId,
      nome: item.nome,
      preco: item.preco,
      quantidade: item.quantidade,
      estoque: item.estoque,
      imagem: item.imagem,
    }));
    const pedido: NovoPedido = {
      usuarioId: this.authService.usuarioAtual?.id ?? null,
      usuarioEmail: this.authService.usuarioAtual?.email ?? null,
      data: new Date().toISOString(),
      produtos: itensPedido,
      total: this.calcularTotal(),
    };

    this.pedidosService.incluir(pedido).subscribe({
      next: () => {
        const exclusoes = this.listaItens.map((item) => this.service.excluir(item.id));
        forkJoin(exclusoes).subscribe({
          next: () => {
            this.listaItens = [];
            this.sucesso = 'Compra finalizada e pedido registrado.';
            this.finalizando = false;
          },
          error: () => {
            this.erro = 'O pedido foi registrado, mas não foi possível limpar o carrinho.';
            this.finalizando = false;
          },
        });
      },
      error: () => {
        this.erro = 'Não foi possível registrar o pedido. O carrinho não foi alterado.';
        this.finalizando = false;
      },
    });
  }

  calcularTotal(): number {
    let total = 0;
    for (let item of this.listaItens) {
      total = total + item.preco * item.quantidade;
    }
    return total;
  }

  calcularUnidades(): number {
    let unidades = 0;
    for (let item of this.listaItens) {
      unidades = unidades + item.quantidade;
    }
    return unidades;
  }
}