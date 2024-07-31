import { client } from '~/entry.server';
import invariant from 'tiny-invariant';
import { getPlayerInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getPlayerInfo';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(client, 'Client is not initialized');
  const user = client.users[Math.floor(Math.random() * client.users.length)];
  invariant(user, 'Player not found');
  const type = params.type;
  const id = parseInt(params.userId!);
  const player = await getPlayerInfo(user, id);
  return { player };
};

export default function User() {
  const { player } = useLoaderData<typeof loader>();
  return (
    <div>
      <div>
        <pre>{JSON.stringify(player, null, 2)}</pre>
      </div>
    </div>
  );
}
