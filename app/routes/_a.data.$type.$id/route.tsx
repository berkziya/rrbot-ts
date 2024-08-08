import { useLoaderData } from '@remix-run/react';
import { getPlayerInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getPlayerInfo';
import { getRegionInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getRegionInfo';
import { getAutonomyInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getAutonomyInfo';
import { getStateInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getStateInfo';
import { getFactoryInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getFactoryInfo';
import { LoaderFunctionArgs } from '@remix-run/node';
import ClientHandler from '~/.server/clientHandler';

export async function loader({ params }: LoaderFunctionArgs) {
  const client = await ClientHandler.getInstance();
  const user = await client.getUser();
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
