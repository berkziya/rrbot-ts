import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = parseInt(params.id!);
  const type = params.type;

  const availableClient = UserHandler.getInstance();
  const user = availableClient.getUser();
  invariant(user, "No user found");

  let data: any = null;
  if (type === "player") {
    data = await getPlayerInfo(user, id);
  } else if (type === "region") {
    data = await getRegionInfo(user, id);
  } else if (type === "autonomy") {
    data = await getAutonomyInfo(user, id);
  } else if (type === "state") {
    data = await getStateInfo(user, id);
  } else if (type === "factory") {
    data = await getFactoryInfo(user, id);
  } else if (type === "war") {
    data = await getWarInfo(user, id);
  }
  return { data };
}

export default function DataView() {
  const { data } = useLoaderData<typeof loader>();

  return <p>{JSON.stringify(data)}</p>;
}
