import { inject, Injectable } from '@angular/core';
import { ItemCarrinho } from '../models/item-carrinho.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private API = 'http://localhost:3000/carrinho';
  private carrinhoHTTP = inject(HttpClient);

  constructor() { }

  listar(): Observable<ItemCarrinho[]> {
    return this.carrinhoHTTP.get<ItemCarrinho[]>(this.API);
  }

  incluir(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.carrinhoHTTP.post<ItemCarrinho>(this.API, item);
  }

  alterar(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.carrinhoHTTP.put<ItemCarrinho>(`${this.API}/${item.id}`, item);
  }

  excluir(id: number): Observable<void> {
    return this.carrinhoHTTP.delete<void>(`${this.API}/${id}`);
  }

}