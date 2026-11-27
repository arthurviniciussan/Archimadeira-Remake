import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Carrinho } from '../models/carrinho.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private readonly api = 'http://localhost:3000/carrinhos';
  private readonly http = inject(HttpClient);

  async obterOuCriar(usuarioId: number): Promise<Carrinho> {
    const carrinhos = await firstValueFrom(
      this.http.get<Carrinho[]>(`${this.api}?usuarioId=${usuarioId}`),
    );
    if (carrinhos.length > 0) {
      return carrinhos[0];
    }

    return firstValueFrom(
      this.http.post<Carrinho>(this.api, { usuarioId, itens: [] }),
    );
  }

  async adicionar(
    usuarioId: number,
    produtoId: number,
    _estoqueDisponivel: number,
  ): Promise<Carrinho> {
    const carrinho = await this.obterOuCriar(usuarioId);
    const item = carrinho.itens.find((atual) => atual.produtoId === produtoId);

    if (item) {
      item.quantidade += 1;
    } else {
      carrinho.itens.push({ produtoId, quantidade: 1 });
    }

    return this.salvar(carrinho);
  }

  async atualizarQuantidade(
    usuarioId: number,
    produtoId: number,
    quantidade: number,
  ): Promise<Carrinho> {
    const carrinho = await this.obterOuCriar(usuarioId);
    const item = carrinho.itens.find((atual) => atual.produtoId === produtoId);
    if (item) {
      item.quantidade = quantidade;
    }

    return this.salvar(carrinho);
  }

  async remover(usuarioId: number, produtoId: number): Promise<Carrinho> {
    const carrinho = await this.obterOuCriar(usuarioId);
    carrinho.itens = carrinho.itens.filter((item) => item.produtoId !== produtoId);
    return this.salvar(carrinho);
  }

  async esvaziar(usuarioId: number): Promise<Carrinho> {
    const carrinho = await this.obterOuCriar(usuarioId);
    carrinho.itens = [];
    return this.salvar(carrinho);
  }

  private salvar(carrinho: Carrinho): Promise<Carrinho> {
    return firstValueFrom(
      this.http.put<Carrinho>(`${this.api}/${carrinho.id}`, carrinho),
    );
  }
}
