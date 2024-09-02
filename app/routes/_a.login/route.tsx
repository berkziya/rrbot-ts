import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import ClientHandler from '~/.server/clientHandler';
import { stringify } from 'flatted';

export async function action({ request }: ActionFunctionArgs) {
  const availableClient = await ClientHandler.getInstance();
  const client = await availableClient.getClient();
  invariant(client, 'Client not initialized');

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const isMobile = formData.get('isMobile') === 'on';

  const user = await client.createUserContext({ isMobile });
  const userId = await user?.login(email, password);
  invariant(userId, 'Login failed');

  const users = [...client.users];
  return { users, userId };
}

export default function Login() {
  const { users, userId } = useActionData<typeof action>() || {};
  const newUser = users?.find((x) => x.id == userId);

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
      {/* {error && <p className='text-red-500'>{error}</p>} */}
      {newUser && <p>{stringify(newUser)}</p>}
    </div>
  );
}
