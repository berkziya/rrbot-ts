import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { UserContext } from 'ozen-bot/dist/UserContext';
import invariant from 'tiny-invariant';
import ClientHandler from '~/.server/clientHandler';

export async function action({ request }: ActionFunctionArgs) {
  const client = await (await ClientHandler.getInstance()).getClient();
  invariant(client, 'Client not initialized');
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const isMobile = formData.get('isMobile') === 'on';

  try {
    const user = await client.createUserContext({ isMobile });
    const id = await user!.login(email, password);
    invariant(id, 'Login failed');

    const users = [...client.users];
    return json({ users, id });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 400 });
  }
}

export default function Login() {
  const data = useActionData<{
    error?: string;
    users?: UserContext[];
    id?: number;
  }>();
  const newUser = data?.users?.find((x) => x.id == data.id);
  return (
    <div className='flex flex-col items-center m-12'>
      <Form method='post' className='flex flex-col gap-4'>
        <input type='email' name='email' autoFocus={true} className='' />
        <input type='password' name='password' className='' />
        <label>
          <input type='checkbox' name='isMobile' /> is Mobile
        </label>
        <button type='submit'>Submit</button>
      </Form>
      {data?.error && <p className='text-red-500'>{data.error}</p>}
      {newUser && <p>{JSON.stringify(newUser, null, 2)}</p>}
    </div>
  );
}
