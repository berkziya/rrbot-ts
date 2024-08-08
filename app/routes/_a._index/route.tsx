import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import ClientHandler from '~/.server/clientHandler';

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const client = (await ClientHandler.getInstance()).getClient();
  invariant(client, 'Client not initialized');
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await client.createUserContext();
  const result = await user.login(email, password);

  invariant(result, 'Login failed');
  const users = [...client.users];
  return json({ users });
}

export default function Login() {
  const users = useActionData();
  return (
    <div className='flex flex-col items-center m-12'>
      <Form method='post' className='flex flex-col gap-4'>
        <input type='email' name='email' autoFocus={true} className='' />
        <input type='password' name='password' className='' />
        <button type='submit'>Submit</button>
      </Form>
      {users ? <p>{JSON.stringify(users, null, 2)}</p> : null}
    </div>
  );
}
