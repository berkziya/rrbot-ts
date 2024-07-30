import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node';
import {
  Form,
  useActionData,
  useNavigate,
  useOutletContext,
} from '@remix-run/react';
import { useEffect } from 'react';
import invariant from 'tiny-invariant';
import { client } from '~/entry.server';

export async function loader({ request }: LoaderFunctionArgs) {
  return true;
}

export async function action({ request }: ActionFunctionArgs) {
  invariant(client, 'Client is not initialized');

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const context = await client.createUserContext();
  const result = await context.login(email, password);

  invariant(result, 'Login failed');

  return json({ result });
}

export default function Login() {
  // const data = useActionData<typeof action>();
  const users = useOutletContext();

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
