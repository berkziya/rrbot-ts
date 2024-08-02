import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { client } from '~/entry.server';
import { getPlayerInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getPlayerInfo';
import { getRegionInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getRegionInfo';
import { getAutonomyInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getAutonomyInfo';
import { getStateInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getStateInfo';
import { LoaderFunctionArgs } from '@remix-run/node';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(client, 'Client is not initialized');
  const user = client.users[Math.floor(Math.random() * client.users.length)];
  invariant(user, 'Player not found');
  const id = parseInt(params.id!);
  const type = params.type;
  let data: any = null;
  if (type === 'player') {
    data = await getPlayerInfo(user, id);
  } else if (type === 'region') {
    data = await getRegionInfo(user, id);
  } else if (type === 'autonomy') {
    data = await getAutonomyInfo(user, id);
  } else if (type === 'state') {
    data = await getStateInfo(user, id);
  }
  return { data };
};

export const route = () => {
  const { data } = useLoaderData<typeof loader>();
  return <pre>{JSON.stringify(data)}</pre>;
};

export default route;
