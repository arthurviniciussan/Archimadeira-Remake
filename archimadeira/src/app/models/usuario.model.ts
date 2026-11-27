export interface Usuario {
  id: number;
  cpf: string;
  nome: string;
  sobrenome: string;
  dtNascimento: string;
  email: string;
  cep: string;
  logradouro: string;
  numeroCasa: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  senha: string;
  tipo: 'admin' | 'usuario';
}

export interface NovoUsuario {
  cpf: string;
  nome: string;
  sobrenome: string;
  dtNascimento: string;
  email: string;
  cep: string;
  logradouro: string;
  numeroCasa: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  senha: string;
  tipo: 'admin' | 'usuario';
}

export interface SessaoUsuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'usuario';
}
