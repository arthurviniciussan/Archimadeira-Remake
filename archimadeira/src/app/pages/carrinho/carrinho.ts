import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly carrinhoService = inject(CarrinhoService);
  private readonly produtosService = inject(ProdutosService);
  private readonly pedidosService = inject(PedidosService);
  readonly authService = inject(AuthService);

  listaItens: ItemCarrinhoExibicao[] = [];
  erro = '';
  sucesso = '';
  finalizando = false;
  pedidoRegistrado = false;

  ngOnInit(): void {
    if (!this.authService.usuarioAtual) {
      return;
    }

    void this.carregarItens();
  }

  async carregarItens(): Promise<void> {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      this.listaItens = [];
      return;
    }

    const carrinho = await this.carrinhoService.obterOuCriar(usuario.id);
    const produtos = await firstValueFrom(this.produtosService.listar());
    this.listaItens = [];

    for (const item of carrinho.itens) {
      const produto = produtos.find((atual) => atual.id === item.produtoId) ?? null;
      this.listaItens.push({ ...item, produto });
    }

    this.changeDetector.markForCheck();
  }

  async aumentar(item: ItemCarrinhoExibicao): Promise<void> {
    await this.atualizarQuantidade(item, item.quantidade + 1);
  }

  async diminuir(item: ItemCarrinhoExibicao): Promise<void> {
    if (item.quantidade <= 1) {
      return;
    }

    await this.atualizarQuantidade(item, item.quantidade - 1);
  }

  private async atualizarQuantidade(item: ItemCarrinhoExibicao, quantidade: number): Promise<void> {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      return;
    }

    await this.carrinhoService.atualizarQuantidade(usuario.id, item.produtoId, quantidade);
    await this.carregarItens();
    this.changeDetector.markForCheck();
  }

  async remover(produtoId: number): Promise<void> {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      return;
    }

    await this.carrinhoService.remover(usuario.id, produtoId);
    this.pedidoRegistrado = false;
    await this.carregarItens();
    this.changeDetector.markForCheck();
  }

  async esvaziar(): Promise<void> {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      return;
    }

    await this.carrinhoService.esvaziar(usuario.id);
    this.listaItens = [];
    this.pedidoRegistrado = false;
    this.changeDetector.markForCheck();
  }

  async finalizarCompra(): Promise<void> {
    const usuario = this.authService.usuarioAtual;
    if (!usuario || this.listaItens.length === 0 || this.finalizando || this.pedidoRegistrado) {
      return;
    }

    this.sucesso = '';
    this.finalizando = true;

    const carrinho = await this.carrinhoService.obterOuCriar(usuario.id);
    const produtos = await firstValueFrom(this.produtosService.listar());
    const itensPedido: ItemPedido[] = [];

    for (const item of carrinho.itens) {
      const produto = produtos.find((atual) => atual.id === item.produtoId);
      if (!produto) {
        continue;
      }

      itensPedido.push({
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: item.quantidade,
        estoque: produto.estoque,
        imagem: produto.imagem,
      });

      await firstValueFrom(this.produtosService.editar({
        ...produto,
        estoque: produto.estoque - item.quantidade,
      }));
    }

    let total = 0;
    for (const item of itensPedido) {
      total += item.preco * item.quantidade;
    }

    const pedido: NovoPedido = {
      usuarioId: usuario.id,
      usuarioEmail: usuario.email,
      data: new Date().toISOString(),
      produtos: itensPedido,
      total,
    };

    await firstValueFrom(this.pedidosService.incluir(pedido));
    await this.carrinhoService.esvaziar(usuario.id);

    this.pedidoRegistrado = false;
    this.sucesso = 'Compra finalizada e pedido registrado.';
    this.finalizando = false;

    await this.carregarItens();
    this.changeDetector.markForCheck();
  }

  calcularTotal(): number {
    let total = 0;
    for (const item of this.listaItens) {
      total += (item.produto?.preco ?? 0) * item.quantidade;
    }
    return total;
  }

  calcularUnidades(): number {
    let unidades = 0;
    for (const item of this.listaItens) {
      unidades += item.quantidade;
    }
    return unidades;
  }
}

interface ItemCarrinhoExibicao extends ItemCarrinho {
  produto: Produto | null;
}
