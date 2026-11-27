import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { ProdutosService } from '../../services/produtos.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly timersAdicionado = new Map<number, ReturnType<typeof setTimeout>>();
  produtosService = inject(ProdutosService);
  carrinhoService = inject(CarrinhoService);
  authService = inject(AuthService);

  erro = '';
  erroProdutos = '';
  carregandoProdutos = true;
  readonly produtosAdicionados = new Set<number>();

  categorias = [
    { nome: 'Salas & Sofás', detalhe: 'Mais de 140 modelos', imagem: '/assets/images/sofa2lugares.jpeg' },
    { nome: 'Quartos & Camas', detalhe: 'Camas box e maciças', imagem: '/assets/images/camaNogueira.jpg' },
    { nome: 'Cozinha & Jantar', detalhe: 'Mesas, cadeiras e aparadores', imagem: '/assets/images/mesa.jpg' },
    { nome: 'Escritório', detalhe: 'Mesas e estantes de trabalho', imagem: '/assets/images/escritorio.avif' }
  ];

  produtos: ProdutoCard[] = [];

  ngOnInit(): void {
    this.produtosService.listar().subscribe((produtos) => {
      this.produtos = produtos.map(({ id, nome, descricao, preco, imagem, estoque }) => ({
        id,
        nome,
        descricao,
        preco,
        imagem,
        estoque,
      }));
      this.carregandoProdutos = false;
      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy(): void {
    for (const timer of this.timersAdicionado.values()) {
      clearTimeout(timer);
    }
    this.timersAdicionado.clear();
  }

  async adicionarAoCarrinho(produto: ProdutoCard): Promise<void> {
    const usuario = this.authService.usuarioAtual;
    if (!usuario) {
      return;
    }

    await this.carrinhoService.adicionar(usuario.id, produto.id, produto.estoque);
    this.produtosAdicionados.add(produto.id);

    const timerAnterior = this.timersAdicionado.get(produto.id);
    if (timerAnterior !== undefined) {
      clearTimeout(timerAnterior);
    }

    const timer = setTimeout(() => {
      this.produtosAdicionados.delete(produto.id);
      this.timersAdicionado.delete(produto.id);
      this.changeDetector.markForCheck();
    }, 1000);
    this.timersAdicionado.set(produto.id, timer);

    this.changeDetector.markForCheck();
  }
}

interface ProdutoCard {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  estoque: number;
}
