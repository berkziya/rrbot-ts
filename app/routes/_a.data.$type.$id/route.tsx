import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { client } from '~/entry.server';
import { getPlayerInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getPlayerInfo';
import { getRegionInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getRegionInfo';
import { getAutonomyInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getAutonomyInfo';
import { getStateInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getStateInfo';
import { getFactoryInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getFactoryInfo';
import { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(client, 'Client is not initialized');
  const usersArray = [...client.users];
  const user = usersArray[Math.floor(Math.random() * usersArray.length)];
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
  } else if (type === 'factory') {
    data = await getFactoryInfo(user, id);
  }
  return { data };
}

export const route = () => {
  const { data } = useLoaderData<typeof loader>();
  return <p>{JSON.stringify(data)}</p>;
};

export default route;
