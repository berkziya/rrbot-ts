import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mainPageInfo } from 'ozen-bot/dist/baseFunctions/getInfo/misc/mainPageInfo';
import { storageInfo } from 'ozen-bot/dist/baseFunctions/getInfo/misc/storageInfo';
import invariant from 'tiny-invariant';
import ClientHandler from '~/.server/clientHandler';

export async function loader({ params }: LoaderFunctionArgs) {
  const playerId = parseInt(params.id!);
  const client = await ClientHandler.getInstance();
  const user = await client.getUser(playerId);
  invariant(user, 'No user found');
  await storageInfo(user);
  const data = await mainPageInfo(user);
  return data;
}

export default function UserPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
