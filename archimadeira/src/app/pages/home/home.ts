import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  
  categorias = [
    { nome: 'Salas & Sofás', detalhe: 'Mais de 140 modelos', imagem: '/assets/images/sofa2lugares.jpeg' },
    { nome: 'Quartos & Camas', detalhe: 'Camas box e maciças', imagem: '/assets/images/camaNogueira.jpg' },
    { nome: 'Cozinha & Jantar', detalhe: 'Mesas, cadeiras e aparadores', imagem: '/assets/images/mesa.jpg' },
    { nome: 'Escritório', detalhe: 'Mesas e estantes de trabalho', imagem: '/assets/images/escritorio.avif' }
  ];

  produtos = [
    { nome: 'Sofá 3 Lugares Retrátil e Reclinável', preco: '5.900,00', desconto: '10% OFF', imagem: '/assets/images/sofa3lugares.jpeg' },
    { nome: 'Sofá Retrátil Aramis 2 lugares - 2,90m', preco: '5.400,00', desconto: '8% OFF', imagem: '/assets/images/sofa2lugares.jpeg' },
    { nome: 'Cama de Casal Madeira Maciça', preco: '4.483,00', desconto: 'MADEIRA NOBRE', imagem: '/assets/images/camaNogueira.jpg' },
    { nome: 'Mesa de jantar redonda 6 lugares', preco: '1.500,00', desconto: '30% OFF', imagem: '/assets/images/mesa.jpg' },
    { nome: 'Mesa escritorio', preco: '1.900,00', desconto: '10% OFF', imagem: '/assets/images/escritorio.avif' },
    { nome: 'Mesa de jantar 8 lugares', preco: '2.000,00', desconto: '30% OFF', imagem: '/assets/images/mesa-jantar.png' }
  ];
}