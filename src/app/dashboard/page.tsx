import { currentUser } from '@/lib/current-user';

export default async function Dashboard() {
  const user = await currentUser();   // nunca null, porque middleware ya filtró
  return <div>Hola {user?.name ?? 'creador'}</div>;
}