import { LoaderFunctionArgs } from '@remix-run/node';
import { useOutletContext, useParams } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
  return true;
}

export default function User() {
  const userId = useParams().userId;
  const users = useOutletContext();
  return (
    <div>
      <div>
        <pre>{JSON.stringify(userId, null, 2)}</pre>
      </div>
    </div>
  );
}
