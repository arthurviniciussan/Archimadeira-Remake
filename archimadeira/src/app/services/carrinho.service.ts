import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { Carrinho, ItemCarrinho, NovoCarrinho } from '../models/carrinho.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private readonly api = 'http://localhost:3000/carrinhos';
  private readonly http = inject(HttpClient);

  obterOuCriar(usuarioId: number | string): Observable<Carrinho> {
    return this.buscar(usuarioId).pipe(
      switchMap((carrinho) => {
        if (carrinho) {
          return of(carrinho);
        }

        const novoCarrinho: NovoCarrinho = { usuarioId, itens: [] };
        return this.http.post<Carrinho>(this.api, novoCarrinho);
      }),
    );
  }

  adicionar(
    usuarioId: number | string,
    produtoId: number,
    estoqueDisponivel: number,
  ): Observable<Carrinho> {
    if (!Number.isInteger(estoqueDisponivel) || estoqueDisponivel < 1) {
      return throwError(() => new Error('Produto sem estoque.'));
    }

    return this.obterOuCriar(usuarioId).pipe(
      switchMap((carrinho) => {
        const existente = carrinho.itens.find((item) => item.produtoId === produtoId);
        if (existente && existente.quantidade >= estoqueDisponivel) {
          return throwError(
            () => new Error(`Só temos ${estoqueDisponivel} unidades em estoque.`),
          );
        }

        const itens = existente
          ? carrinho.itens.map((item) =>
            item.produtoId === produtoId
              ? { ...item, quantidade: item.quantidade + 1 }
              : item,
          )
          : [...carrinho.itens, { produtoId, quantidade: 1 }];

        return this.salvar(carrinho, itens);
      }),
    );
  }

  atualizarQuantidade(
    usuarioId: number | string,
    produtoId: number,
    quantidade: number,
  ): Observable<Carrinho> {
    if (!Number.isInteger(quantidade) || quantidade < 1) {
      return throwError(() => new Error('A quantidade deve ser um inteiro maior que zero.'));
    }

    return this.obterOuCriar(usuarioId).pipe(
      switchMap((carrinho) => {
        if (!carrinho.itens.some((item) => item.produtoId === produtoId)) {
          return throwError(() => new Error('O produto não está no carrinho.'));
        }

        const itens = carrinho.itens.map((item) =>
          item.produtoId === produtoId ? { ...item, quantidade } : item,
        );
        return this.salvar(carrinho, itens);
      }),
    );
  }

  remover(usuarioId: number | string, produtoId: number): Observable<Carrinho> {
    return this.obterOuCriar(usuarioId).pipe(
      switchMap((carrinho) =>
        this.salvar(
          carrinho,
          carrinho.itens.filter((item) => item.produtoId !== produtoId),
        ),
      ),
    );
  }

  esvaziar(usuarioId: number | string): Observable<Carrinho> {
    return this.obterOuCriar(usuarioId).pipe(
      switchMap((carrinho) => this.salvar(carrinho, [])),
    );
  }

  private buscar(usuarioId: number | string): Observable<Carrinho | null> {
    return this.http
      .get<Carrinho[]>(this.api, { params: { usuarioId: String(usuarioId) } })
      .pipe(
        map((carrinhos) => {
          if (carrinhos.length > 1) {
            throw new Error(`Mais de um carrinho encontrado para o cliente ${usuarioId}.`);
          }
          return carrinhos[0] ?? null;
        }),
      );
  }

  private salvar(carrinho: Carrinho, itens: ItemCarrinho[]): Observable<Carrinho> {
    return this.http.put<Carrinho>(`${this.api}/${carrinho.id}`, { ...carrinho, itens });
  }
}