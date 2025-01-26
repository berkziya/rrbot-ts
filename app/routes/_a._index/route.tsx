import { UserService } from "@berkziya/ozen-bot";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function action({ request }: ActionFunctionArgs) {
  const client = UserService.getInstance();
  invariant(client, "Client not initialized");

  const formData = await request.formData();
  const who = formData.get("who") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await client.createUser(who, email, password);
  invariant(user?.id, "Login failed");

  return { user };
}

export default function Login() {
  const { user } = useActionData<typeof action>() || {};

  return (
    <div className="flex flex-col items-center m-12">
      <Form method="post" className="flex flex-col gap-4">
        <input
          type="text"
          name="who"
          className="p-2 border border-gray-400 rounded-md"
        />
        <input
          type="email"
          name="email"
          className="p-2 border border-gray-400 rounded-md"
        />
        <input
          type="password"
          name="password"
          className="p-2 border border-gray-400 rounded-md"
        />
        <button type="submit">Submit</button>
      </Form>
      {user && <p>{JSON.stringify(user)}</p>}
    </div>
  );
}
