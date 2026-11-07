import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { CarrinhoComponent } from './pages/carrinho/carrinho';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { AdminClientesComponent } from './pages/admin/clientes/clientes';
import { AdminProdutosComponent } from './pages/admin/produtos/produtos';
import { Produtos } from './pages/produtos/produtos';
import { EditarProduto } from './pages/produtos/editar-produto/editar-produto';
import { ModalExcluirProdutoComponent } from './pages/produtos/modal-excluir-produto/modal-excluir-produto';
import { ConsultaProdutos } from './pages/produtos/consulta-produtos/consulta-produtos';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'cadastro', component: CadastroComponent },
	{ path: 'carrinho', component: CarrinhoComponent },
	{ path: 'admin/clientes', component: AdminClientesComponent },
	{ path: 'admin/produtos', component: AdminProdutosComponent },
	{ path: 'clientes', redirectTo: 'admin/clientes', pathMatch: 'full' },
	{ path: 'manutencao-produtos', redirectTo: 'admin/produtos', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'produtos', component: Produtos },
	{ path: 'editar-produto', component: EditarProduto }, 
	{ path: 'produtos/consulta', component: ConsultaProdutos }, 
	{ path: '**', redirectTo: '' }
];
