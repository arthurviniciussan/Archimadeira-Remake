import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Produto } from '../../../models/produto.model';
import { AuthService } from '../../../services/auth.service';
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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  listaProdutos: Produto[] = [];
  mostrarFormulario = false;
  salvando = false;
  erro = '';
  produtoEmEdicaoId: number | null = null;
  novoProduto: NovoProduto = this.produtoVazio();

  ngOnInit(): void {
    if (this.authService.usuarioAtual?.tipo !== 'admin') {
      this.router.navigate(['/']);
      return;
    }

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

  editarProduto(produto: Produto): void {
    this.produtoEmEdicaoId = produto.id;
    this.novoProduto = {
      nome: produto.nome,
      descricao: produto.descricao,
      estoque: produto.estoque,
      preco: produto.preco,
      imagem: produto.imagem,
    };
    this.mostrarFormulario = true;
    this.erro = '';
  }

  salvarProduto(): void {
    if (this.produtoEmEdicaoId === null) {
      this.incluirProduto();
      return;
    }

    const produtoOriginal = this.listaProdutos.find(
      (produto) => produto.id === this.produtoEmEdicaoId,
    );
    if (!produtoOriginal) {
      this.erro = 'Não foi possível encontrar o produto para editar.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    const produtoAtualizado: Produto = { ...produtoOriginal, ...this.novoProduto };
    this.service.editar(produtoAtualizado).subscribe({
      next: (produto) => {
        this.listaProdutos = this.listaProdutos.map((item) =>
          item.id === produto.id ? produto : item,
        );
        this.cancelarInclusao();
        this.salvando = false;
      },
      error: () => {
        this.erro = 'Não foi possível atualizar o produto. Tente novamente.';
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
    this.produtoEmEdicaoId = null;
    this.mostrarFormulario = false;
  }

  abrirNovoProduto(): void {
    this.cancelarInclusao();
    this.mostrarFormulario = true;
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
