import { faker } from '@faker-js/faker';

export type UserRow = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  joinDate: string;
};

const roles: UserRow['role'][] = ['Admin', 'Editor', 'Viewer'];
const statuses: UserRow['status'][] = ['Active', 'Inactive'];

export function generateDummyUsers(count = 1000): UserRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: faker.helpers.arrayElement(roles),
    status: faker.helpers.arrayElement(statuses),
    joinDate: faker.date
      .between({ from: '2023-01-01', to: '2025-12-31' })
      .toISOString()
      .split('T')[0],
  }));
}

export const dummyData = generateDummyUsers(1500);
