import { json, Link, Outlet, useLoaderData } from '@remix-run/react';
import { Player } from 'ozen-bot/dist/entity/Player';
import { UserContext } from 'ozen-bot/dist/UserContext';
import invariant from 'tiny-invariant';
import ClientHandler from '~/.server/clientHandler';

export async function loader() {
  const client = await (await ClientHandler.getInstance()).getClient();
  invariant(client, 'Client is not initialized');
  const users: UserContext[] = [...client.users];
  return json({ users });
}

export default function Players() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className='flex flex-col bg-gray-300'>
      <div className='flex flex-row'>
        <Link to='/' className='p-6 content-center bg-cyan-200'>
          <h1>Add</h1>
        </Link>
        {data.users.map((u) => (
          <Link
            key={`${u.id}-${u.isMobile ? 'mobile' : ''}`}
            to={`/p/${u.id}`}
            className='p-6 content-center bg-cyan-200 even:bg-cyan-300'
          >
            {(u.player as Player).name}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
