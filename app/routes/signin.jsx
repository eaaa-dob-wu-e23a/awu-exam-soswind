import { Form, useLoaderData, NavLink } from "@remix-run/react";
import { auth } from "../sessions/auth.server";
import { sessionStorage  } from "../sessions/session.server";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request }) {
    // If the user is already authenticated redirect to /posts directly
    await auth.isAuthenticated(request, {
      successRedirect: "/posts"
    });
    // Retrieve error message from session if present
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    // Get the error message from the session
    const error = session.get("authError");
  
    session.unset("authError");
    
    const headers = new Headers({
      "Set-Cookie": await sessionStorage.commitSession(session),
    });
  
    return json({ error }, { headers}); // return the error message
  }


export default function Signin() {
    const loaderData = useLoaderData();
    console.log("error", loaderData?.error);

    return (

        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg">
            <img src="exam-logo.png" alt="logo" className="flex h-20 w-30 mb-8 justify-center" />

            <h1 className="font-semibold text-xl">Log ind</h1>
            <Form className="flex flex-col w-full" id="signin-form" method="post">
            <label className="font-semibold" htmlFor="mail">E-mail</label>
            <input type="email" id="email" name="email" placeholder="test@mail.dk" required
            className="p-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400" />

            <label className="font-semibold" htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="1234"
            className="p-4 mb-8 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400" />

            <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400" type="submit">Log ind</button><br></br>

            {loaderData?.error ? (
                <div className="text-center text-red-600 font-semibold text-xl">    
                <p className=" text-red-500 p-8">{loaderData?.error.message}</p>
            </div>
            ) : null}
            </Form>

            <p>
                <NavLink to="/signup" className="p-8 m-8 text-orange-600 hover:underline">Har du ikke en konto? Opret en her</NavLink>
            </p>

            </div>
        </div>
    );
}


export async function action({ request }) {
    return await auth.authenticate("user-pass", request, {
      successRedirect: "/profile",
      failureRedirect: "/signin"
    });
  }
    