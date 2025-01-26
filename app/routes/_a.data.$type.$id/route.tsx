import {
  getAutonomyInfo,
  getFactoryInfo,
  getPlayerInfo,
  getRegionInfo,
  getStateInfo,
  getWarInfo,
} from "@berkziya/ozen-bot";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  const id = parseInt(params.id!);
  const type = params.type;

  let data: any = null;
  if (type === "player") {
    data = await getPlayerInfo(id);
  } else if (type === "region") {
    data = await getRegionInfo(id);
  } else if (type === "autonomy") {
    data = await getAutonomyInfo(id);
  } else if (type === "state") {
    data = await getStateInfo(id);
  } else if (type === "factory") {
    data = await getFactoryInfo(id);
  } else if (type === "war") {
    data = await getWarInfo(id);
  }
  return { data };
}

export default function DataView() {
  const { data } = useLoaderData<typeof loader>();

  return <p>{JSON.stringify(data)}</p>;
}
