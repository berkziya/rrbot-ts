import { Link, Outlet, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { client } from '~/entry.server';

export const loader = async () => {
  invariant(client, 'Client is not initialized');
  const users = client.users;
  return { users };
};

export default function Players() {
  const { users } = useLoaderData<typeof loader>();
  return (
    <div className='flex flex-col bg-gray-300'>
      <div className='flex flex-row'>
        <Link to='/' className='p-6 content-center bg-cyan-200'>
          <h1>Add</h1>
        </Link>
        {users.map((u) => (
          <Link
            to={`/users/${u.id}`}
            className='p-6 content-center bg-cyan-200 even:bg-cyan-300'
          >
            {u.id}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
