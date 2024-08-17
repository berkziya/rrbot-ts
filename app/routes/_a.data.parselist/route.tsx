import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import {
  getCitizenList,
  getResidentList,
  getStateCitizens,
  getStateResidents,
  getWarDamageList,
} from 'ozen-bot/dist/baseFunctions/getInfo/misc/getPlayerList';
import invariant from 'tiny-invariant';
import ClientHandler from '~/.server/clientHandler';

export async function action({ request }: ActionFunctionArgs) {
  const availableClient = await ClientHandler.getInstance();
  const user = await availableClient.getUser();
  invariant(user, 'No user found');
  const formData = await request.formData();
  const list = formData.get('list') as string;
  const id = parseInt(formData.get('id') as string);
  let players: any[] = [];
  switch (list) {
    case 'citizenList':
      players = await getCitizenList(user, id);
      break;
    case 'residentList':
      players = await getResidentList(user, id);
      break;
    case 'stateCitizens':
      players = await getStateCitizens(user, id);
      break;
    case 'stateResidents':
      players = await getStateResidents(user, id);
      break;
    case 'warDef':
      players = await getWarDamageList(user, id, false);
      break;
    case 'warAttack':
      players = await getWarDamageList(user, id, true);
      break;
  }
  return { players };
}

export default function Parser() {
  const actionData = useActionData<typeof action>();
  return (
    <div className='flex flex-col bg-gray-300'>
      <h1 className='text-2xl text-center'>Parse List</h1>
      <Form method='post'>
        <select name='list' className='border p-1'>
          <option value='citizenList'>Citizen List</option>
          <option value='residentList'>Resident List</option>
          <option value='stateCitizens'>State Citizens</option>
          <option value='stateResidents'>State Residents</option>
          <option value='warDef'>War Defenders</option>
          <option value='warAttack'>War Attackers</option>
        </select>
        <input type='text' name='id' className='border p-1' />
        <button type='submit' className='p-2 bg-blue-500 text-white'>
          Parse
        </button>
      </Form>
      {actionData?.players && (
        <div>
          {actionData.players.map((player) => (
            <div key={player.id} className='border p-1 flex justify-between'>
              <div className='font-bold'>{player.id}</div>
              <div>{player.name}</div>
              <div>{player.level}</div>
              <div>{player.damage}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
