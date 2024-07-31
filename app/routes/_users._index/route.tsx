import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { client } from '~/entry.server';

export async function loader() {
  return { users: client?.users };
}

export async function action({ request }: ActionFunctionArgs) {
  invariant(client, 'Client is not initialized');

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await client.createUserContext();
  const result = await user.login(email, password);

  invariant(result, 'Login failed');

  return json({ users: client.users });
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
      {/* {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null} */}
      {users ? <pre>{JSON.stringify(users, null, 2)}</pre> : null}
    </div>
  );
}
