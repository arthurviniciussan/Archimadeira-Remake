export interface Cliente {
  id: number;
  nome: string;
  email: string;
  cep: string;
  logradouro: string;
  numeroCasa: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  estado: string;
}
