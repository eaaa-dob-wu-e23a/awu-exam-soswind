import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";



export async function loader() {

    const events = await mongoose.models.Event.find()
        .sort({ date: "asc" })
        .populate("createdBy");
    
    return json({ events });

}

export default function Events() {
    const { events } = useLoaderData();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-black-500">Events</h1>
                <ul>
                    {events.map((event, index) => (
                        <li key={index} className="py-4 text-center text-sm text-black-500">
                            <div className="mr-2">{event.title}</div>
                            <div className="mr-2">Lokation: {event.location}</div>
                            <div className="mr-2">Dato: {new Date(event.date).toLocaleDateString()} kl. {event.time}</div>
                            <Link to={`/events/${event._id}`}>
                                <button className="bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">
                                    Se event
                                </button>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

}

