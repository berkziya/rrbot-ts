import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getWarList } from 'ozen-bot/dist/functions/getInfo/misc/getWarList';
import { UserHandler } from 'ozen-bot/dist/UserHandler';
import invariant from 'tiny-invariant';

export async function loader({ params }: LoaderFunctionArgs) {
  const stateId = parseInt(params.id!);
  const client = UserHandler.getInstance();
  const user = client.getUser();
  invariant(user, 'No user found');

  const data = await getWarList(user, stateId);
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
