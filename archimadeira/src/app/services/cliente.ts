import { Injectable, } from '@angular/core';
import { Cliente } from '../models/cliente.model';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    constructor() { }
    listar(): Cliente[] {
        return [
            {
                id: 1,
                cpf: "12345678901",
                nome: "Arthur",
                sobrenome: "Silva",
                dtNascimento: "1998-05-12",
                email: "arthur.silva@email.com",
                cep: "05508-000",
                logradouro: "Avenida Professor Lineu Prestes",
                numeroCasa: "700",
                complemento: "Apto 42",
                bairro: "Butantã",
                cidade: "São Paulo",
                municipio: "São Paulo",
                estado: "SP"
            },
            {
                id: 2,
                cpf: "23456789012",
                nome: "Ana",
                sobrenome: "Souza",
                dtNascimento: "2000-09-25",
                email: "ana.souza@email.com",
                cep: "05359-010",
                logradouro: "Rodovia Raposo Tavares",
                numeroCasa: "1500",
                bairro: "Jardim Bonfiglioli",
                cidade: "São Paulo",
                municipio: "São Paulo",
                estado: "SP"
            },
            {
                id: 3,
                cpf: "34567890123",
                nome: "Alice",
                sobrenome: "Oliveira",
                dtNascimento: "1995-03-18",
                email: "alice.oliveira@email.com",
                cep: "01310-100",
                logradouro: "Avenida Paulista",
                numeroCasa: "1000",
                complemento: "Bloco B",
                bairro: "Bela Vista",
                cidade: "São Paulo",
                municipio: "São Paulo",
                estado: "SP"
            },
            {
                id: 4,
                cpf: "45678901234",
                nome: "Paulo Henrique",
                sobrenome: "Santos",
                dtNascimento: "1992-11-05",
                email: "paulo.henrique@email.com",
                cep: "01001-000",
                logradouro: "Praça da Sé",
                numeroCasa: "50",
                bairro: "Sé",
                cidade: "São Paulo",
                municipio: "São Paulo",
                estado: "SP"
            },
            {
                id: 5,
                cpf: "56789012345",
                nome: "Ronaldo",
                sobrenome: "Lima",
                dtNascimento: "1990-07-22",
                email: "ronaldo.lima@email.com",
                cep: "05426-200",
                logradouro: "Avenida das Nações Unidas",
                numeroCasa: "4777",
                complemento: "Torre A",
                bairro: "Alto de Pinheiros",
                cidade: "São Paulo",
                municipio: "São Paulo",
                estado: "SP"
            },
            {
                id: 6,
                cpf: "67890123456",
                nome: "Guilherme",
                sobrenome: "Menezes",
                dtNascimento: "1994-11-01",
                email: "guilherme.menezes@email.com",
                cep: "05359-020",
                logradouro: "Rodovia Raposo Tavares",
                numeroCasa: "15",
                complemento: "Bloco C",
                bairro: "Butantã",
                cidade: "São Paulo",
                municipio: "São Paulo",
                estado: "SP"
            },
            {
                id: 7,
                cpf: "78901234567",
                nome: "Eduardo",
                sobrenome: "Costa",
                dtNascimento: "1996-04-14",
                email: "eduardo.costa@email.com",
                cep: "05407-002",
                logradouro: "Avenida Rebouças",
                numeroCasa: "1200",
                complemento: "Conjunto 101",
                bairro: "Pinheiros",
                municipio: "São Paulo",
                cidade: "São Paulo",
                estado: "SP"
            }
        ];
    }
}