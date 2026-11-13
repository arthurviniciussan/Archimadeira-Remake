import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemCarrinho, NovoItemCarrinho } from '../models/item-carrinho.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private readonly api = 'http://localhost:3000/carrinho';
  private readonly http = inject(HttpClient);

  listar(): Observable<ItemCarrinho[]> {
    return this.http.get<ItemCarrinho[]>(this.api);
  }

  incluir(item: NovoItemCarrinho): Observable<ItemCarrinho> {
    return this.http.post<ItemCarrinho>(this.api, item);
  }

  alterar(item: ItemCarrinho): Observable<ItemCarrinho> {
    return this.http.put<ItemCarrinho>(`${this.api}/${item.id}`, item);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

}