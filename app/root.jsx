import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  
} from "@remix-run/react";
import styles from "./tailwind.css";
import { auth } from "./sessions/auth.server";

import Navbar from "./components/Navbar";
import LoggedInNavbar from "./components/LoggedInNavbar";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return [{ title: "Aarhus Events" }];
}

export async function loader({ request }) {
  return await auth.isAuthenticated(request);
}


export default function App() {
  const user = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="icon" type="image/png" href="/favicon-logo.png" /> {/* Tilføj dette linje */}

      </head>
      <body>
        {user ? <LoggedInNavbar /> : <Navbar />}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
