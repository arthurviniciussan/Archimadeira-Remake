import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ItemCarrinho } from '../../models/item-carrinho.model';
import { Produto } from '../../models/produto.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { ProdutosService } from '../../services/produtos.services';

@Component({
  selector: 'app-carrinho',
  imports: [CurrencyPipe],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class CarrinhoComponent implements OnInit {
  private service = inject(CarrinhoService);
  private produtosService = inject(ProdutosService);

  listaItens: ItemCarrinho[] = [];
  listaProdutos: Produto[] = [];

  ngOnInit(): void {
    this.carregarItens();

    this.produtosService.listar().subscribe({
      next: (produtos) => {
        this.listaProdutos = produtos;
      }
    });
  }
  
  carregarItens() {
    this.service.listar().subscribe({
      next: (itens) => {
        this.listaItens = itens;
      }
    });
  }
  adicionar(produto: Produto) {
    if (produto.estoque < 1) {
      alert('Produto sem estoque.');
      return;
    }
    for (let item of this.listaItens) {
      if (item.produtoId === produto.id) {
        alert('Este produto já está no carrinho. Use os botões + e − para mudar a quantidade.');
        return;
      }
    }

    let novoItem = {} as ItemCarrinho;
    novoItem.produtoId = produto.id;
    novoItem.nome = produto.nome;
    novoItem.preco = produto.preco;
    novoItem.estoque = produto.estoque;
    novoItem.quantidade = 1;
    novoItem.imagem = '';

    this.service.incluir(novoItem).subscribe({
      next: () => {
        this.carregarItens();
      }
    });
  }

  aumentar(item: ItemCarrinho) {
    if (item.quantidade >= item.estoque) {
      alert(`Só temos ${item.estoque} unidades em estoque.`);
      return;
    }
    item.quantidade = item.quantidade + 1;
    this.service.alterar(item).subscribe({
      next: (itemAlterado) => {
        console.log('Quantidade alterada:', itemAlterado.quantidade);
      }
    });
  }

  diminuir(item: ItemCarrinho) {
    if (item.quantidade <= 1) {
      alert('A quantidade mínima é 1. Para tirar o produto, use "Remover".');
      return;
    }
    item.quantidade = item.quantidade - 1;
    this.service.alterar(item).subscribe({
      next: (itemAlterado) => {
        console.log('Quantidade alterada:', itemAlterado.quantidade);
      }
    });
  }
  remover(id: number) {
    this.service.excluir(id).subscribe({
      next: () => {
        this.listaItens = this.listaItens.filter(item => item.id !== id);
      }
    });
  }

  esvaziar() {
    for (let item of this.listaItens) {
      this.service.excluir(item.id).subscribe({
        next: () => {
          console.log('Item removido:', item.nome);
        }
      });
    }
    this.listaItens = [];
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