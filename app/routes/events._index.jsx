import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { Link, useLoaderData, Form, useNavigate } from "@remix-run/react";
import { sessionStorage } from "../sessions/session.server";
import { useState, useEffect } from "react";


export async function loader({ request }) {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('searchTerm');

    const query = searchTerm
        ? { $or: [{ 'name': new RegExp(searchTerm, 'i') }, { 'location': new RegExp(searchTerm, 'i') }] }
        : {};

    const events = await mongoose.models.Event.find(query)
        .sort({ date: "asc" })
        .populate("createdBy");

        const session = await sessionStorage.getSession(request.headers.get("Cookie"));
        const currentUserId = session ? session.userId : null;
    
    return json({ events, currentUserId }, session ? 200 : 401);

}

export default function Events() {
    const { events, currentUserId } = useLoaderData();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm) {
            navigate(`/events?searchTerm=${searchTerm}`);
        }
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value || '');
    };
    

    if (status === 401) {
    
    }
    

    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">

            <Form onSubmit={handleSearch}>
                <div className="flex items-center mb-4">
                <input 
                type="text"
                placeholder="Søg efter event"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-lg border-gray-300 rounded-lg shadow-sm p-2 flex-grow"
                />
                <button className=" bg-orange-500 hover:bg-orange-400 border rounded-lg text-white p-2 ml-4 w-24" type="submit">Søg</button>
                </div>
            </Form>


            <div className="max-w-md w-full space-y-6">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-black-500">Events i Aarhus</h1>
                <p className="flex text-center text-m font-semibold m-6 py-4">Her kan du se en oversigt over de events, der finder sted i Aarhus i den kommende periode.</p>
                <ul>

                {events.map((event, index) => (
                        <li key={index} className="py-4 text-center text-sm text-black-500 border border-gray-300 rounded-lg shadow-sm p-4 mb-4">
                            <div className="mr-2 py-6 font-semibold text-2xl">{event.title}</div>
                            <div className="mr-2 text-lg font-semibold">Lokation: {event.location}</div>
                            <div className="mr-2 text-lg font-semibold">Dato: {new Date(event.date).toLocaleDateString()} kl. {event.time}</div>
                            <div className="flex justify-center">
                             <Link to={`/events/${event._id}`}>
                            <button className="bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">
                                Se event
                              </button>
                             </Link>
                             </div>

                         {event.createdBy._id === currentUserId && (

                            <div className="space-y-4">
                            <div className="flex justify-center">
                            <button className="bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">
                               Rediger event
                             </button>
                           </div>

                            <div className="flex justify-center">
                            <button className="bg-red-600 hover:bg-red-400 text-white font-bold py-2 px-4 rounded mt-4">
                                Slet event
                              </button>
                             </div>
                          </div>
                        )}
                     </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

