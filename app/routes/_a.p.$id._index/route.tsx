import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderFunctionArgs) {
  const playerId = parseInt(params.id!);
  const client = UserHandler.getInstance();
  const user = client.getUser(playerId);
  invariant(user, "No user found");
  await storageInfo(user);
  const data = await mainPageInfo(user);
  return { data };
}

export default function UserPage() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}
