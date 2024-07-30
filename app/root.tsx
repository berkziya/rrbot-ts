import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import './tailwind.css';
import { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  // Fetch initial data here
  const data = await fetchInitialData();
  return data;
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <div className='layout'>
          <div className='content'>{children}</div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData();
  return <Outlet context={data} />;
}

async function fetchInitialData() {
  // Replace with your data fetching logic
  return { key: 'value' };
}
