import { Link, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader() {
  const client = UserHandler.getInstance();
  invariant(client, "Client is not initialized");

  return { users: [...client.users] };
}

export default function Players() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col bg-gray-300">
      <div className="flex flex-row">
        <Link to="/" className="p-6 content-center bg-cyan-200">
          <h1>Add</h1>
        </Link>
        {users.map((u) => (
          <Link
            key={`${u.who}-${u.isMobile ? "mobile" : ""}`}
            to={`/p/${(u.player as Player).id}`}
            className="p-6 content-center bg-cyan-200 even:bg-cyan-300"
          >
            {(u.player as Player).name}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
