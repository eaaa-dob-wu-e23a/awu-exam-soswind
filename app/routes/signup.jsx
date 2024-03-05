import { Form, useLoaderData, NavLink } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { auth } from "../sessions/auth.server";
import mongoose from "mongoose";
import { sessionStorage } from "../sessions/session.server";


export async function loader({ request }) {

    await auth.isAuthenticated(request, {
        successRedirect: "/signin"
    });

    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const error = session.get("authError");
    session.unset("authError");

    const headers = new Headers({
        "Set-Cookie": await sessionStorage.commitSession(session),
    });

    return json({ error }, { headers });
}



export default function Signup() {
    const loaderData = useLoaderData();

    return (


        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-lg">
                <img src="exam-logo.png" alt="logo" className="flex h-20 w-30 mb-8 justify-center" />

                <h1 className="font-semibold text-xl">Opret bruger</h1>
                <Form className="flex flex-col w-full" id="signup" method="post">
                    <label className="font-semibold" htmlFor="username">Navn</label>
                    <input type="text" id="username" name="username" placeholder="Jane Doe" required className="p-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400" />

                    <label className="font-semibold" htmlFor="email">E-mail</label>
                    <input type="email" id="email" name="email" placeholder="test@mail.dk" required className="p-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400" />

                    <label className="font-semibold" htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="1234" required className="p-4 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400" />

                    <label className="font-semibold" htmlFor="confirmPassword">Gentag password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="1234" required className="p-4 mb-8 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400" />

                    <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400" type="submit">Opret bruger</button>
                </Form>

                <p>
                    <NavLink to="/signin" className="p-8 m-8 text-orange-600 hover:underline">Har du allerede en konto? Log ind her</NavLink>
                </p>

            </div>
        </div>

    );

}

export async function action({ request }) {
    const formData = await request.text();
    const { username, email, password, confirmPassword } = Object.fromEntries(new URLSearchParams(formData));
    const result = await mongoose.models.User.create({ username, email, password, confirmPassword });

    if (result) {
        return redirect("/signin");
    } else {
        return redirect("/signup");
    }

}
