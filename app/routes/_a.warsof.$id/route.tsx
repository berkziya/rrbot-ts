import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { UserService, getWarList } from "ozen-bot";

export async function loader({ params }: LoaderFunctionArgs) {
  const stateId = parseInt(params.id!);
  const client = UserService.getInstance();
  const user = client.getUser();
  invariant(user, "No user found");

  const data = await getWarList(stateId);
  return data;
}

export default function UserPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
