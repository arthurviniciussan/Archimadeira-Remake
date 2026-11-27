import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
  let service: CarrinhoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CarrinhoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates a cart for the requested customer when none exists', () => {
    service.obterOuCriar(7).subscribe((carrinho) => {
      expect(carrinho.usuarioId).toBe(7);
      expect(carrinho.itens).toEqual([]);
    });

    const busca = http.expectOne(
      (request) => request.url === 'http://localhost:3000/carrinhos'
        && request.params.get('usuarioId') === '7',
    );
    expect(busca.request.method).toBe('GET');
    busca.flush([]);

    const criacao = http.expectOne('http://localhost:3000/carrinhos');
    expect(criacao.request.method).toBe('POST');
    expect(criacao.request.body).toEqual({ usuarioId: 7, itens: [] });
    criacao.flush({ id: 2, usuarioId: 7, itens: [] });
  });

  it('updates only the selected product quantity in that customer cart', () => {
    service.adicionar(7, 3, 5).subscribe((carrinho) => {
      expect(carrinho.itens).toEqual([
        { produtoId: 3, quantidade: 3 },
        { produtoId: 4, quantidade: 1 },
      ]);
    });

    const busca = http.expectOne(
      (request) => request.url === 'http://localhost:3000/carrinhos'
        && request.params.get('usuarioId') === '7',
    );
    busca.flush([{
      id: 2,
      usuarioId: 7,
      itens: [
        { produtoId: 3, quantidade: 2 },
        { produtoId: 4, quantidade: 1 },
      ],
    }]);

    const atualizacao = http.expectOne('http://localhost:3000/carrinhos/2');
    expect(atualizacao.request.method).toBe('PUT');
    expect(atualizacao.request.body.usuarioId).toBe(7);
    atualizacao.flush({
      id: 2,
      usuarioId: 7,
      itens: [
        { produtoId: 3, quantidade: 3 },
        { produtoId: 4, quantidade: 1 },
      ],
    });
  });

  it('does not increase a cart item beyond available stock', () => {
    let erro = '';
    service.adicionar(7, 3, 2).subscribe({
      error: (error: Error) => {
        erro = error.message;
      },
    });

    const busca = http.expectOne(
      (request) => request.url === 'http://localhost:3000/carrinhos'
        && request.params.get('usuarioId') === '7',
    );
    busca.flush([{
      id: 2,
      usuarioId: 7,
      itens: [{ produtoId: 3, quantidade: 2 }],
    }]);

    expect(erro).toBe('Só temos 2 unidades em estoque.');
    http.expectNone('http://localhost:3000/carrinhos/2');
  });
});
