import { Routes } from '@angular/router';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { CarrinhoComponent } from './pages/carrinho/carrinho';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { AdminUsuariosComponent } from './pages/admin/usuarios/usuarios';
import { AdminProdutosComponent } from './pages/admin/produtos/produtos';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'cadastro', component: CadastroComponent },
	{ path: 'carrinho', component: CarrinhoComponent },
	{ path: 'admin/usuarios', component: AdminUsuariosComponent },
	{ path: 'admin/produtos', component: AdminProdutosComponent },
	{ path: 'admin/clientes', redirectTo: 'admin/usuarios' },
	{ path: 'clientes', redirectTo: 'admin/usuarios' },
	{ path: 'manutencao-produtos', redirectTo: 'admin/produtos'},
	{ path: 'login', component: LoginComponent },
	{ path: 'produtos', redirectTo: '', pathMatch: 'full' },
	{ path: 'editar-produto', redirectTo: 'admin/produtos', pathMatch: 'full' },
	{ path: 'produtos/consulta', redirectTo: '', pathMatch: 'full' },
	{ path: '**', redirectTo: '' }
];
