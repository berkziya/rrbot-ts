import { ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { UserHandler } from 'ozen-bot/dist/UserHandler';
import invariant from 'tiny-invariant';

export async function action({ request }: ActionFunctionArgs) {
  const client = UserHandler.getInstance();
  invariant(client, 'Client not initialized');

  const formData = await request.formData();
  const who = formData.get('who') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await client.createUser(who, email, password);
  invariant(user?.id, 'Login failed');

  return { user };
}

export default function Login() {
  const { user } = useActionData<typeof action>() || {};

  return (
    <div className='flex flex-col items-center m-12'>
      <Form method='post' className='flex flex-col gap-4'>
        <input type='text' name='who' autoFocus={true} className='' />
        <input type='email' name='email' autoFocus={true} className='' />
        <input type='password' name='password' className='' />
        <button type='submit'>Submit</button>
      </Form>
      {user && <p>{JSON.stringify(user)}</p>}
    </div>
  );
}
