import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NovoPedido, Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private readonly api = 'http://localhost:3000/pedidos';
  private readonly http = inject(HttpClient);

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.api);
  }

  incluir(pedido: NovoPedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.api, pedido);
  }
}
