import { Form } from "@remix-run/react";
import { auth } from "../sessions/auth.server";

export default function Profile() {

    return ( 

       <div className = "flex items-center justify-center h-screen bg-gray-100" >
        <h1>Din profil</h1>
        <h2>Brugeroplysninger</h2>
        {/*}  <p>Navn: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Oprettede events: {user.events}</p>
    <p>Events tilmeldt: {user.events}</p>*/}


        <Form method="post">
        <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg
         hover:bg-orange-400">Log ud</button>
        </Form>

        </div>
        

    );

}


export async function action({ request }) {
    await auth.logout(request, { redirectTo: "/signin" });
} 