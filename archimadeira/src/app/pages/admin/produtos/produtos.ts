import { Component, inject, OnInit } from '@angular/core';
import { ProdutoService } from '../../../services/produto';
import { Produto } from '../../../models/produto.model';

import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-admin-produtos',
  standalone: true,
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
  imports: [RouterLink],
})
export class AdminProdutosComponent implements OnInit {

  private service = inject(ProdutoService);
    listaProdutos: Produto[] = [];
    
    ngOnInit(): void {
    this.service.listar().subscribe({
      next: (produtos) => {
        console.log('Dados recebidos da API:', produtos);
        this.listaProdutos = produtos;
      },
      error: (erro) => {
        console.error('ERRO AO BUSCAR NA API:', erro);

      }
      })

  }

      excluir(id: string) {
        if (id !== undefined && confirm('Deseja realmente excluir o produto?')) {
          this.service.excluir(id).subscribe({
            next: () => {
              this.listaProdutos = this.listaProdutos.filter(produto => produto.id !==  id);
            }
          });
        }
      }
    }
