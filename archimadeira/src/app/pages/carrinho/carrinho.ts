import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ItemCarrinho } from '../../models/carrinho.model';
import { ItemPedido, NovoPedido } from '../../models/pedido.model';
import { Produto } from '../../models/produto.model';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { PedidosService } from '../../services/pedidos.service';
import { ProdutosService } from '../../services/produtos.services';

@Component({
  selector: 'app-carrinho',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class CarrinhoComponent implements OnInit {
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly produtosService = inject(ProdutosService);
  private readonly pedidosService = inject(PedidosService);
  readonly authService = inject(AuthService);

  listaItens: ItemCarrinhoExibicao[] = [];
  listaProdutos: Produto[] = [];
  erro = '';
  sucesso = '';
  finalizando = false;
  pedidoRegistrado = false;

  ngOnInit(): void {
    if (!this.authService.usuarioAtual) {
      this.erro = 'Entre na sua conta para acessar o carrinho salvo.';
      this.produtosService.listar().subscribe({
        next: (produtos) => {
          this.listaProdutos = produtos;
        },
        error: () => {
          this.erro = 'Não foi possível carregar os produtos. Verifique se o JSON Server está em execução.';
        },
      });
      return;
    }

    this.carregarItens();
  }
  
  carregarItens(limparErro = true): void {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      this.listaItens = [];
      return;
    }

    forkJoin({
      carrinho: this.carrinhoService.obterOuCriar(usuario.id),
      produtos: this.produtosService.listar(),
    }).subscribe({
      next: ({ carrinho, produtos }) => {
        this.listaProdutos = produtos;
        this.listaItens = carrinho.itens.map((item) => ({
          ...item,
          produto: produtos.find((produto) => produto.id === item.produtoId) ?? null,
        }));
        if (limparErro) {
          this.erro = this.listaItens.some((item) => !item.produto)
            ? 'Há um produto do carrinho que não está mais cadastrado.'
            : '';
        }
      },
      error: () => {
        this.erro = 'Não foi possível carregar o carrinho. Verifique se o JSON Server está em execução.';
      },
    });
  }

  adicionar(produto: Produto): void {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      this.erro = 'Entre na sua conta para adicionar produtos ao carrinho.';
      return;
    }

    if (produto.estoque < 1) {
      this.erro = 'Produto sem estoque.';
      return;
    }

    this.erro = '';
    const existente = this.listaItens.find((item) => item.produtoId === produto.id);
    if (existente && existente.quantidade >= produto.estoque) {
      this.erro = `Só temos ${produto.estoque} unidades em estoque.`;
      return;
    }

    this.carrinhoService.adicionar(usuario.id, produto.id, produto.estoque).subscribe({
      next: () => this.carregarItens(),
      error: () => {
        this.erro = 'Não foi possível adicionar o produto ao carrinho. Tente novamente.';
      },
    });
  }

  aumentar(item: ItemCarrinhoExibicao): void {
    if (!item.produto) {
      this.erro = 'Não foi possível localizar o produto para atualizar o carrinho.';
      return;
    }
    if (item.quantidade >= item.produto.estoque) {
      this.erro = `Só temos ${item.produto.estoque} unidades em estoque.`;
      return;
    }
    this.atualizarQuantidade(item, item.quantidade + 1);
  }

  diminuir(item: ItemCarrinhoExibicao): void {
    if (item.quantidade <= 1) {
      this.erro = 'A quantidade mínima é 1. Para tirar o produto, use "Remover".';
      return;
    }
    this.atualizarQuantidade(item, item.quantidade - 1);
  }

  atualizarQuantidade(item: ItemCarrinhoExibicao, quantidade: number): void {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      this.erro = 'Entre na sua conta para alterar o carrinho.';
      return;
    }

    this.erro = '';
    this.carrinhoService.atualizarQuantidade(usuario.id, item.produtoId, quantidade).subscribe({
      next: () => this.carregarItens(),
      error: () => {
        this.erro = 'Não foi possível atualizar a quantidade. Tente novamente.';
      },
    });
  }

  remover(produtoId: number): void {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      this.erro = 'Entre na sua conta para remover itens do carrinho.';
      return;
    }

    this.carrinhoService.remover(usuario.id, produtoId).subscribe({
      next: () => {
        this.pedidoRegistrado = false;
        this.carregarItens();
      },
      error: () => {
        this.erro = 'Não foi possível remover o produto do carrinho. Tente novamente.';
      },
    });
  }

  esvaziar(): void {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      this.erro = 'Entre na sua conta para esvaziar o carrinho.';
      return;
    }

    this.erro = '';
    this.carrinhoService.esvaziar(usuario.id).subscribe({
      next: () => {
        this.listaItens = [];
        this.pedidoRegistrado = false;
        this.erro = '';
      },
      error: () => {
        this.erro = 'Não foi possível esvaziar o carrinho. Tente novamente.';
      },
    });
  }

  async finalizarCompra(): Promise<void> {
    const usuario = this.authService.usuarioAtual;
    if (!usuario || this.listaItens.length === 0 || this.finalizando || this.pedidoRegistrado) {
      return;
    }

    this.erro = '';
    this.sucesso = '';
    this.finalizando = true;
    let etapa: 'validacao' | 'estoque' | 'pedido' | 'limpeza' = 'validacao';
    let pedidoRegistrado = false;
    const estoqueAnterior: Produto[] = [];

    try {
      const { carrinho, produtos } = await firstValueFrom(
        forkJoin({
          carrinho: this.carrinhoService.obterOuCriar(usuario.id),
          produtos: this.produtosService.listar(),
        }),
      );
      if (carrinho.itens.length === 0) {
        throw new Error('O carrinho está vazio.');
      }

      const itensComProduto = carrinho.itens.map((item) => {
        const produto = produtos.find((atual) => atual.id === item.produtoId);
        if (!produto) {
          throw new Error('Um produto do carrinho não está mais cadastrado.');
        }
        if (!Number.isInteger(item.quantidade) || item.quantidade < 1) {
          throw new Error(`A quantidade de ${produto.nome} é inválida.`);
        }
        if (item.quantidade > produto.estoque) {
          throw new Error(`Estoque insuficiente para ${produto.nome}.`);
        }
        return { item, produto };
      });

      const itensPedido: ItemPedido[] = itensComProduto.map(({ item, produto }) => ({
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: item.quantidade,
        estoque: produto.estoque,
        imagem: produto.imagem,
      }));
      const pedido: NovoPedido = {
        usuarioId: usuario.id,
        usuarioEmail: usuario.email,
        data: new Date().toISOString(),
        produtos: itensPedido,
        total: itensPedido.reduce((total, item) => total + item.preco * item.quantidade, 0),
      };

      etapa = 'estoque';
      for (const { item, produto } of itensComProduto) {
        estoqueAnterior.push(produto);
        await firstValueFrom(
          this.produtosService.editar({
            ...produto,
            estoque: produto.estoque - item.quantidade,
          }),
        );
      }

      etapa = 'pedido';
      await firstValueFrom(this.pedidosService.incluir(pedido));
      pedidoRegistrado = true;
      this.pedidoRegistrado = true;

      etapa = 'limpeza';
      await firstValueFrom(this.carrinhoService.esvaziar(usuario.id));
      this.pedidoRegistrado = false;
      this.sucesso = 'Compra finalizada e pedido registrado.';
    } catch (error) {
      if (pedidoRegistrado) {
        this.erro = 'O pedido foi registrado, mas não foi possível limpar o carrinho. Esvazie-o antes de tentar outra compra.';
      } else if (estoqueAnterior.length > 0) {
        let falhaAoRestaurarEstoque = false;
        for (const produto of [...estoqueAnterior].reverse()) {
          try {
            await firstValueFrom(this.produtosService.editar(produto));
          } catch {
            falhaAoRestaurarEstoque = true;
          }
        }

        this.erro = falhaAoRestaurarEstoque
          ? 'A compra falhou e não foi possível restaurar todo o estoque. Confira os produtos no painel administrativo.'
          : etapa === 'pedido'
            ? 'Não foi possível registrar o pedido. O estoque anterior foi restaurado.'
            : 'Não foi possível atualizar o estoque. As alterações foram revertidas.';
      } else {
        this.erro = error instanceof Error && error.name === 'Error'
          ? error.message
          : 'Não foi possível validar o carrinho. Verifique se o JSON Server está em execução.';
      }
    } finally {
      this.finalizando = false;
      this.carregarItens(false);
    }
  }

  calcularTotal(): number {
    return this.listaItens.reduce(
      (total, item) => total + (item.produto?.preco ?? 0) * item.quantidade,
      0,
    );
  }

  calcularUnidades(): number {
    return this.listaItens.reduce((unidades, item) => unidades + item.quantidade, 0);
  }
}

interface ItemCarrinhoExibicao extends ItemCarrinho {
  produto: Produto | null;
}