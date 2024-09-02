import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import ClientHandler from '~/.server/clientHandler';
import { getWarList } from 'ozen-bot/dist/baseFunctions/getInfo/misc/getWarList';
import { stringify } from 'flatted';

export async function loader({ params }: LoaderFunctionArgs) {
  const stateId = parseInt(params.id!);
  const client = await ClientHandler.getInstance();
  const user = await client.getUser();
  invariant(user, 'No user found');

  const data = await getWarList(user, stateId);
  return data;
}

export default function UserPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>{stringify(data)}</p>
    </div>
  );
}
