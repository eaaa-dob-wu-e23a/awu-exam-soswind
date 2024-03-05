import { Form } from "@remix-run/react";
import { auth } from "../sessions/auth.server";


export async function loader({ request }) {

    await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });
    return {};
}

export default function AddEvent() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Opret event</h1>
    
                <Form method="post" id="event-form" className="mt-8 space-y-6"> 
                    <div className="rounded-md shadow-sm -space-y-px">
                        <label htmlFor="title" className="sr-only">Titel på event</label>
                        <input type="text" id="title" name="title" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Titel på event" />
    
                        <label htmlFor="description" className="sr-only">Beskrivelse</label>
                        <textarea id="description" name="description" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Beskrivelse"></textarea>
    
                        <label htmlFor="date" className="sr-only">Dato</label>
                        <input type="date" id="date" name="date" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
    
                        <label htmlFor="time" className="sr-only">Tidspunkt</label>
                        <input type="time" id="time" name="time" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
    
                        <label htmlFor="location" className="sr-only">Lokation</label>
                        <input type="text" id="location" name="location" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Lokation" />
                    </div>
    
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Opret event</button>
                        <button type="reset" className="mt-3 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Annuller</button>
                    </div>
                </Form>
            </div>
        </div>
    );
}