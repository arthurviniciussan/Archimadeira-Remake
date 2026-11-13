import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../../models/produto.model';
import { NovoProduto, ProdutosService } from '../../../services/produtos.services';

@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
  imports: [CurrencyPipe, FormsModule],
})
export class AdminProdutosComponent implements OnInit {
  service = inject(ProdutosService);

  listaProdutos: Produto[] = [];
  mostrarFormulario = false;
  salvando = false;
  erro = '';
  novoProduto: NovoProduto = this.produtoVazio();

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.service.listar().subscribe({
      next: (produtos) => {
        this.listaProdutos = produtos;
        this.erro = '';
      },
      error: () => {
        this.erro = 'Não foi possível carregar os produtos. Verifique se o JSON Server está em execução.';
      },
    });
  }

  incluirProduto(): void {
    this.salvando = true;
    this.erro = '';

    this.service.incluir(this.novoProduto).subscribe({
      next: (produto) => {
        this.listaProdutos = [...this.listaProdutos, produto];
        this.novoProduto = this.produtoVazio();
        this.mostrarFormulario = false;
        this.salvando = false;
      },
      error: () => {
        this.erro = 'Não foi possível salvar o produto. Tente novamente.';
        this.salvando = false;
      },
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir o produto?')) {
      return;
    }

    this.erro = '';
    this.service.excluir(id).subscribe({
      next: () => {
        this.listaProdutos = this.listaProdutos.filter((produto) => produto.id !== id);
      },
      error: () => {
        this.erro = 'Não foi possível excluir o produto. Tente novamente.';
      },
    });
  }

  cancelarInclusao(): void {
    this.novoProduto = this.produtoVazio();
    this.mostrarFormulario = false;
  }

  produtoVazio(): NovoProduto {
    return {
      nome: '',
      descricao: '',
      estoque: 0,
      preco: 0,
      imagem: '',
    };
  }
}
