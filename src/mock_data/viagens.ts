import { Viagem, CreateViagemDto, PacienteViagem, Acompanhante, CasaApoio } from "../types";
import { getPacientes, updatePacienteStatus } from "./index";
import { updateVeiculoStatus, getVeiculoById, getVeiculos } from "./veiculos";
import { getCasasApoio } from "./casasApoio";
import { PACIENTE_STATUS, VEICULOS_STATUS, VIAGEM_STATUS } from "../constants";

// tempo maximo de delay em milisegundos
const MAX_DELAY_MS = 1000;

let viagens_key = 4;

const mockedViagens: Viagem[] = [
    {
        id: "1",
        data_hora: new Date(1980, 5, 15).toISOString(),
        status: "Concluída",
        tipo: "Ida",
        cidade_destino: "Campina Grande",
        veiculo: [
            {
                id: "1",
                placa: "XYZ9H7",
                chassi: "hijk123lm456n",
                modelo: "doblo",
                ano: 2020,
                cor: "prata",
                capacidade: 7,
                status: "Inativo",
            },
        ],
        motorista: [
            {
                id: "1",
                nome: "João Silva",
                telefone: "(11) 91234-5678",
                matricula: "MTR001",
            },
        ],
        passageiros: [
            {
                paciente: {
                    id: "1",
                    nome: "José Fernando Alves",
                    cpf: "234.567.890-11",
                    rg: "1.234.567-8",
                    endereco: "Rua A, 123, Cidade X",
                    telefone: "(11) 91234-5678",
                    birthDate: new Date(1980, 5, 15).toISOString(),
                    status: "inativo",
                },
                acompanhante: {
                    id: "a2",
                    nome: "Carla Alves",
                    cpf: "321.654.987-00",
                    telefone: "(11) 98765-4321",
                    parentesco: "conjuge",
                },
            },
            {
                paciente: {
                    id: "4",
                    nome: "Ana Maria Lima",
                    cpf: "456.789.012-33",
                    rg: "4.567.890-1",
                    endereco: "Rua B, 456, Cidade W",
                    telefone: "(11) 93456-7890",
                    birthDate: new Date(1985, 7, 25).toISOString(),
                    status: "inativo",
                },
                acompanhante: undefined,
            },
            {
                paciente: {
                    id: "5",
                    nome: "Pedro Henrique Souza",
                    cpf: "567.890.123-44",
                    rg: "5.678.901-2",
                    endereco: "Rua C, 789, Cidade V",
                    telefone: "(11) 94567-8901",
                    birthDate: new Date(1992, 3, 10).toISOString(),
                    status: "inativo",
                },
                acompanhante: {
                    id: "a4",
                    nome: "Mariana Souza",
                    cpf: "654.321.098-11",
                    telefone: "(11) 97654-3210",
                    parentesco: "irmã",
                },
            },
            {
                paciente: {
                    id: "6",
                    nome: "Lucas Fernandes Rocha",
                    cpf: "678.901.234-55",
                    rg: "6.789.012-3",
                    endereco: "Rua D, 101, Cidade U",
                    telefone: "(11) 95678-9012",
                    birthDate: new Date(1978, 11, 30).toISOString(),
                    status: "inativo",
                },
                acompanhante: undefined,
            },
        ],
        paradas: [
            {
                id: "1",
                nome: "Casa Esperança",
                endereco: "Rua das Flores, 123",
                capacidadeMaxima: 20,
                lotacaoAtual: 15,
            },
        ],
    },
    {
        id: "2",
        data_hora: new Date(1980, 5, 15).toISOString(),
        status: "Concluída",
        tipo: "Ida",
        cidade_destino: "João Pessoa",
        veiculo: [
            {
                id: "2",
                placa: "LMN4K8",
                chassi: "opqr789st012u",
                modelo: "spin",
                ano: 2021,
                cor: "branco",
                capacidade: 7,
                status: "Inativo",
            },
        ],
        motorista: [
            {
                id: "2",
                nome: "Maria Oliveira",
                telefone: "(21) 92345-6789",
                matricula: "MTR002",
            },
        ],
        passageiros: [
            {
                paciente: {
                    id: "2",
                    nome: "Maria Silva Santos",
                    cpf: "123.456.789-00",
                    rg: "2.345.678-9",
                    endereco: "Avenida B, 456, Cidade Y",
                    telefone: "(21) 92345-6789",
                    birthDate: new Date(1990, 10, 20).toISOString(),
                    status: "inativo",
                },
                acompanhante: {
                    id: "a3",
                    nome: "Lucas Santos",
                    cpf: "789.012.345-66",
                    telefone: "(21) 97654-3210",
                    parentesco: "filho",
                },
            },
        ],
        paradas: [
            {
                id: "2",
                nome: "Casa Vida Nova",
                endereco: "Av. Central, 456",
                capacidadeMaxima: 10,
                lotacaoAtual: 10,
            },
        ],
    },
    {
        id: "3",
        data_hora: new Date(1980, 5, 15).toISOString(),
        status: "Concluída",
        tipo: "Ida",
        cidade_destino: "Campina Grande",
        veiculo: [
            {
                id: "3",
                placa: "DEF5G6",
                chassi: "vwxy345za678b",
                modelo: "journey",
                ano: 2018,
                cor: "azul",
                capacidade: 7,
                status: "Em viagem",
            },
        ],
        motorista: [
            {
                id: "3",
                nome: "Carlos Souza",
                telefone: "(31) 93456-7890",
                matricula: "MTR003",
            },
        ],
        passageiros: [
            {
                paciente: {
                    id: "3",
                    nome: "João Pedro Costa",
                    cpf: "345.678.901-22",
                    rg: "3.456.789-0",
                    endereco: "Travessa  C, 789, Cidade Z",
                    telefone: "(31) 93456-7890",
                    birthDate: new Date(1975, 2, 5).toISOString(),
                    status: "inativo",
                },
                acompanhante: {
                    id: "a1",
                    nome: "Ana Alves",
                    cpf: "987.654.321-00",
                    telefone: "(11) 99876-5432",
                    parentesco: "conjuge",
                },
            },
        ],
        paradas: [
            {
                id: "3",
                nome: "Casa Acolher",
                endereco: "Rua do Sol, 89",
                capacidadeMaxima: 15,
                lotacaoAtual: 6,
            },
        ],
    },
];

// Calcula quantos lugares estão ocupados na viagem (pacientes + acompanhantes)
function calcularOcupacao(passageiros: PacienteViagem[]): number {
    return passageiros.reduce((total, p) => {
        return total + 1 + (p.acompanhante ? 1 : 0);
    }, 0);
}

export async function getViagens(): Promise<Viagem[]> {
    await delay();
    return deepCopy(mockedViagens);
}

export async function getViagemById(viagemId: string): Promise<Viagem> {
    await delay();
    const viagem = mockedViagens.find((v) => v.id === viagemId);
    if (!viagem) {
        throw new Error("Viagem not found");
    }
    return deepCopy(viagem);
}

export async function insertViagem(viagem: CreateViagemDto): Promise<Viagem> {
    await delay();

    // Atualizar status do veículo para "Em viagem"
    if (viagem.veiculo[0]) {
        updateVeiculoStatus(viagem.veiculo[0].id, VEICULOS_STATUS.EM_VIAGEM);
    }

    const newViagem: Viagem = {
        ...viagem,
        id: (viagens_key++).toString(),
    };
    mockedViagens.push(newViagem);

    return deepCopy(newViagem);
}

export async function deleteViagem(viagemId: string): Promise<void> {
    await delay();
    const index = mockedViagens.findIndex((v) => v.id === viagemId);
    if (index === -1) {
        throw new Error("Viagem not found");
    }

    const viagem = mockedViagens[index];

    // Não permitir exclusão de viagens concluídas
    if (viagem.status === VIAGEM_STATUS.CONCLUIDA) {
        throw new Error("Não é possível excluir uma viagem concluída");
    }

    // Liberar veículo
    if (viagem.veiculo[0]) {
        updateVeiculoStatus(viagem.veiculo[0].id, VEICULOS_STATUS.INATIVO);
    }

    // Liberar pacientes
    viagem.passageiros.forEach((p) => {
        updatePacienteStatus(p.paciente.id, PACIENTE_STATUS.INATIVO);
    });

    mockedViagens.splice(index, 1);
}

export async function updateViagem(viagemId: string, viagemData: CreateViagemDto): Promise<Viagem> {
    await delay();
    const index = mockedViagens.findIndex((v) => v.id === viagemId);

    if (index === -1) {
        throw new Error("Viagem not found");
    }

    const viagemAnterior = mockedViagens[index];

    // Se a viagem foi concluída, atualizar status de veículos e pacientes
    if (viagemData.status === VIAGEM_STATUS.CONCLUIDA && viagemAnterior.status !== VIAGEM_STATUS.CONCLUIDA) {
        // Liberar veículo
        if (viagemAnterior.veiculo[0]) {
            updateVeiculoStatus(viagemAnterior.veiculo[0].id, VEICULOS_STATUS.INATIVO);
        }
        // Liberar pacientes
        viagemAnterior.passageiros.forEach((p) => {
            updatePacienteStatus(p.paciente.id, PACIENTE_STATUS.INATIVO);
        });
    }

    // Se o veículo mudou, atualizar status do antigo e do novo
    if (viagemData.veiculo[0]?.id !== viagemAnterior.veiculo[0]?.id) {
        if (viagemAnterior.veiculo[0]) {
            updateVeiculoStatus(viagemAnterior.veiculo[0].id, VEICULOS_STATUS.INATIVO);
        }
        if (viagemData.veiculo[0] && viagemData.status !== VIAGEM_STATUS.CONCLUIDA) {
            updateVeiculoStatus(viagemData.veiculo[0].id, VEICULOS_STATUS.EM_VIAGEM);
        }
    }

    mockedViagens[index] = {
        ...mockedViagens[index],
        ...viagemData,
    };

    return deepCopy(mockedViagens[index]);
}

async function delay(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * MAX_DELAY_MS) + 1;
    return new Promise((resolve) => setTimeout(resolve, randomNumber));
}

export async function addPacienteToViagem(
    viagemId: string,
    pacienteId: string,
    acompanhanteId?: string,
): Promise<Viagem> {
    await delay();

    const viagemIndex = mockedViagens.findIndex((v) => v.id === viagemId);
    if (viagemIndex === -1) {
        throw new Error("Viagem não encontrada");
    }

    const viagem = mockedViagens[viagemIndex];

    // Não permitir adicionar passageiros em viagens concluídas
    if (viagem.status === VIAGEM_STATUS.CONCLUIDA) {
        throw new Error("Não é possível adicionar passageiros a uma viagem concluída");
    }

    const pacientes = await getPacientes();
    const paciente = pacientes.find((p) => p.id === pacienteId);
    if (!paciente) {
        throw new Error("Paciente não encontrado");
    }

    // Verificar se paciente já está na viagem
    const pacienteAlreadyInViagem = viagem.passageiros.some((p) => p.paciente.id === pacienteId);
    if (pacienteAlreadyInViagem) {
        throw new Error("Paciente já está na viagem");
    }

    // Verificar se paciente já está em outra viagem em andamento
    if (paciente.status === PACIENTE_STATUS.EM_VIAGEM) {
        throw new Error("Paciente já está em outra viagem");
    }

    // Calcular ocupação atual e verificar capacidade
    const capacidadeVeiculo = viagem.veiculo[0]?.capacidade || 7;
    const ocupacaoAtual = calcularOcupacao(viagem.passageiros);
    const lugaresNecessarios = acompanhanteId ? 2 : 1;

    if (ocupacaoAtual + lugaresNecessarios > capacidadeVeiculo) {
        throw new Error(`Capacidade insuficiente. Disponível: ${capacidadeVeiculo - ocupacaoAtual} lugar(es)`);
    }

    let acompanhante: Acompanhante | undefined;
    if (acompanhanteId) {
        acompanhante = paciente.acompanhantes?.find((a) => a.id === acompanhanteId);
        if (!acompanhante) {
            throw new Error("Acompanhante não encontrado");
        }
    }

    const novoPassageiro: PacienteViagem = {
        paciente,
        acompanhante,
    };

    // Atualizar status do paciente
    updatePacienteStatus(pacienteId, PACIENTE_STATUS.EM_VIAGEM);

    viagem.passageiros.push(novoPassageiro);
    return deepCopy(viagem);
}

export async function removePacienteFromViagem(viagemId: string, pacienteId: string): Promise<Viagem> {
    await delay();

    const viagemIndex = mockedViagens.findIndex((v) => v.id === viagemId);
    if (viagemIndex === -1) {
        throw new Error("Viagem não encontrada");
    }

    const viagem = mockedViagens[viagemIndex];

    // Não permitir remover passageiros de viagens concluídas
    if (viagem.status === VIAGEM_STATUS.CONCLUIDA) {
        throw new Error("Não é possível remover passageiros de uma viagem concluída");
    }

    const passageiroIndex = viagem.passageiros.findIndex((p) => p.paciente.id === pacienteId);
    if (passageiroIndex === -1) {
        throw new Error("Paciente não encontrado na viagem");
    }

    // Atualizar status do paciente
    updatePacienteStatus(pacienteId, PACIENTE_STATUS.INATIVO);

    viagem.passageiros.splice(passageiroIndex, 1);
    return deepCopy(viagem);
}

export async function updatePacienteAcompanhante(
    viagemId: string,
    pacienteId: string,
    acompanhanteId?: string,
): Promise<Viagem> {
    await delay();

    const viagemIndex = mockedViagens.findIndex((v) => v.id === viagemId);
    if (viagemIndex === -1) {
        throw new Error("Viagem não encontrada");
    }

    const viagem = mockedViagens[viagemIndex];

    // Não permitir editar passageiros de viagens concluídas
    if (viagem.status === VIAGEM_STATUS.CONCLUIDA) {
        throw new Error("Não é possível editar passageiros de uma viagem concluída");
    }

    const passageiro = viagem.passageiros.find((p) => p.paciente.id === pacienteId);
    if (!passageiro) {
        throw new Error("Paciente não encontrado na viagem");
    }

    // Se está adicionando acompanhante e não tinha antes, verificar capacidade
    if (acompanhanteId && !passageiro.acompanhante) {
        const capacidadeVeiculo = viagem.veiculo[0]?.capacidade || 7;
        const ocupacaoAtual = calcularOcupacao(viagem.passageiros);
        
        if (ocupacaoAtual + 1 > capacidadeVeiculo) {
            throw new Error("Capacidade insuficiente para adicionar acompanhante");
        }
    }

    if (acompanhanteId) {
        const pacientes = await getPacientes();
        const paciente = pacientes.find((p) => p.id === pacienteId);
        if (!paciente) {
            throw new Error("Paciente não encontrado");
        }

        const acompanhante = paciente.acompanhantes?.find((a) => a.id === acompanhanteId);
        if (!acompanhante) {
            throw new Error("Acompanhante não encontrado");
        }

        passageiro.acompanhante = acompanhante;
    } else {
        passageiro.acompanhante = undefined;
    }

    return deepCopy(viagem);
}

// Funções para gerenciar paradas/rotas da viagem
export async function addParadaToViagem(viagemId: string, casaApoioId: string): Promise<Viagem> {
    await delay();

    const viagemIndex = mockedViagens.findIndex((v) => v.id === viagemId);
    if (viagemIndex === -1) {
        throw new Error("Viagem não encontrada");
    }

    const viagem = mockedViagens[viagemIndex];

    // Não permitir adicionar paradas em viagens concluídas
    if (viagem.status === VIAGEM_STATUS.CONCLUIDA) {
        throw new Error("Não é possível adicionar paradas a uma viagem concluída");
    }

    // Verificar se a parada já existe na viagem
    const paradaExiste = viagem.paradas.some((p) => p.id === casaApoioId);
    if (paradaExiste) {
        throw new Error("Esta parada já está na viagem");
    }

    // Buscar a casa de apoio
    const casasApoio = await getCasasApoio();
    const casaApoio = casasApoio.find((c) => c.id === casaApoioId);
    if (!casaApoio) {
        throw new Error("Casa de apoio não encontrada");
    }

    viagem.paradas.push(casaApoio);
    return deepCopy(viagem);
}

export async function removeParadaFromViagem(viagemId: string, casaApoioId: string): Promise<Viagem> {
    await delay();

    const viagemIndex = mockedViagens.findIndex((v) => v.id === viagemId);
    if (viagemIndex === -1) {
        throw new Error("Viagem não encontrada");
    }

    const viagem = mockedViagens[viagemIndex];

    // Não permitir remover paradas de viagens concluídas
    if (viagem.status === VIAGEM_STATUS.CONCLUIDA) {
        throw new Error("Não é possível remover paradas de uma viagem concluída");
    }

    const paradaIndex = viagem.paradas.findIndex((p) => p.id === casaApoioId);
    if (paradaIndex === -1) {
        throw new Error("Parada não encontrada na viagem");
    }

    viagem.paradas.splice(paradaIndex, 1);
    return deepCopy(viagem);
}

// Função para obter capacidade disponível da viagem
export function getCapacidadeDisponivel(viagemId: string): number {
    const viagem = mockedViagens.find((v) => v.id === viagemId);
    if (!viagem) return 0;
    
    const capacidadeVeiculo = viagem.veiculo[0]?.capacidade || 7;
    const ocupacaoAtual = calcularOcupacao(viagem.passageiros);
    return capacidadeVeiculo - ocupacaoAtual;
}

function deepCopy<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
}
