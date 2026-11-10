import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

export interface NovoProduto {
  nome: string;
  descricao: string;
  estoque: number;
  preco: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private readonly api = 'http://localhost:3000/produtos';
  private readonly http = inject(HttpClient);

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.api);
  }

  incluir(produto: NovoProduto): Observable<Produto> {
    return this.http.post<Produto>(this.api, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  buscarPorID(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.api}/${id}`);
  }

  editar(produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.api}/${produto.id}`, produto);
  }
}
