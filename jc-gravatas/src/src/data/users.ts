import { CustomerUser } from '../types';

export const initialSampleUsers: CustomerUser[] = [
  {
    id: 'user_1',
    name: 'Guilherme Mendonça',
    email: 'guilherme.noivo@gmail.com',
    phone: '(11) 98722-1199',
    cpf: '332.112.449-01',
    password: '123',
    address: {
      cep: '04538-133',
      street: 'Rua Joaquim Floriano',
      number: '820',
      complement: 'Apto 101',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
    },
    createdAt: '2026-06-15T10:00:00.000Z',
  },
  {
    id: 'user_2',
    name: 'Carlos Eduardo Silveira',
    email: 'carlos.adv@silveira.com.br',
    phone: '(82) 99123-4567',
    cpf: '542.981.233-10',
    password: '123',
    address: {
      cep: '57035-000',
      street: 'Avenida Álvaro Otacílio',
      number: '3420',
      complement: 'Bloco B - 502',
      neighborhood: 'Ponta Verde',
      city: 'Maceió',
      state: 'AL',
    },
    createdAt: '2026-07-20T14:30:00.000Z',
  },
];
