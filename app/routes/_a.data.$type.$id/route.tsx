import { useLoaderData } from '@remix-run/react';
import { getPlayerInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getPlayerInfo';
import { getRegionInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getRegionInfo';
import { getAutonomyInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getAutonomyInfo';
import { getStateInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getStateInfo';
import { getFactoryInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getFactoryInfo';
import { getWarInfo } from 'ozen-bot/dist/baseFunctions/getInfo/getWarInfo';
import { LoaderFunctionArgs } from '@remix-run/node';
import ClientHandler from '~/.server/clientHandler';
import invariant from 'tiny-invariant';
import { stringify } from 'flatted';

export async function loader({ params }: LoaderFunctionArgs) {
  const id = parseInt(params.id!);
  const type = params.type;

  const availableClient = await ClientHandler.getInstance();
  const user = await availableClient.getUser();
  invariant(user, 'No user found');

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
  } else if (type === 'war') {
    data = await getWarInfo(user, id);
  }
  return { data };
}

export default function DataView() {
  const { data } = useLoaderData<typeof loader>();

  return <p>{stringify(data)}</p>;
}
