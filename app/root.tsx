import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink, // has isActive, isPending state
  redirect,
  useLoaderData,
  useNavigation, // navigation state: idle, loading, submitting
} from "@remix-run/react";
import { json, type LinksFunction, type MetaFunction } from "@remix-run/node";

import appStylesHref from "./app.css?url"; // url magic
// existing imports
import { getContacts, createEmptyContact } from "./data";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const meta: MetaFunction = () => {
  return [
    {
      title: "Wow 🐶",
    },
  ];
};

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink
                      to={`contacts/${contact.id}`}
                      className={({ isActive, isPending }) => {
                        return isActive ? "active" : isPending ? "pending" : "";
                      }}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? <span>★</span> : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div
          id="detail"
          className={navigation.state === "loading" ? "loading" : ""}
        >
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
