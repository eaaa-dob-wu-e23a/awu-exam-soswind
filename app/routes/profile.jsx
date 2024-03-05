import { Form } from "@remix-run/react";
import { auth } from "../sessions/auth.server";
import { useLoaderData } from "@remix-run/react";


export async function loader({ request }) {
    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });
    return user;
}

export default function Profile() {
    const user = useLoaderData();

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 p-10">
            <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Dine oplysninger</h1>
                <h2 className="text-xl font-semibold mb-2">Brugeroplysninger</h2>
                <p className="mb-2"><strong>Navn:</strong> {user.name}</p>
                <p className="mb-4"><strong>Email:</strong> {user.email}</p>
                <h2 className="text-xl font-semibold mb-2">Dine events</h2>
            </div>
            <div className="flex-1 ml-10 bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Events du er tilmeldt</h1>
              {/* <ul>
                    {user.events.map((event, index) => (
                        <li key={index} className="mb-2">{event}</li>
                    ))}
                </ul>
                <h1 className="text-2xl font-bold mb-4 mt-6">Events du er tilmeldt</h1>
                <ul>
                    {user.registeredEvents.map((event, index) => (
                        <li key={index} className="mb-2">{event}</li>
                    ))}
                    </ul>*/}
                <Form method="post">
                    <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">Log ud</button>
                </Form>
            </div>
        </div>
    );
}

export async function action({ request }) {
    await auth.logout(request, { redirectTo: "/signin" });
}