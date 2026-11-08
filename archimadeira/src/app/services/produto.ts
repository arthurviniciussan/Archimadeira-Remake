import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from './type/type';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProdutoService { 
    private readonly API = 'http://localhost:3000/produtos';

    constructor(private http: HttpClient) { }
    listar(): Observable<Produto[]> {
       return this.http.get<Produto[]>(this.API);
    }

    incluir(produto: Produto): Observable<Produto> {
        return this.http.post<Produto>(this.API, produto);
    }

    excluir(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API}/${id}`);
    }
}