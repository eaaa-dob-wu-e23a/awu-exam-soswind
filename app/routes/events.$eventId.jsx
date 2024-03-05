import { auth } from "../sessions/auth.server";
import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

export async function loader({ request, params }) {
    const authUser = await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    const event = await mongoose.models.Event.findById(params.eventId).populate("createdBy");
    return json ({ event, authUser });
}

export default function Event() {
    const { event, authUser } = useLoaderData();

    function confirmDelete(event) {
        if (!confirm("Er du sikker på at du vil slette dette event?")) {
            event.preventDefault();
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-black-500">{event.title}</h1>
                <p className="mt-2 text-center text-sm text-black-500">{event.date} kl. {event.time}</p>
                <p className="mt-2 text-center text-sm text-black-500">{event.location}</p>
                <p className="mt-2 text-center text-sm text-black-500">{event.price} kr.</p>
                <p className="mt-2 text-center text-sm text-black-500">{event.description}</p>
                <p className="mt-2 text-center text-sm text-black-500">Oprettet af: {event.createdBy.username}</p>


                {authUser._id === event.createdBy._id && (
                    <>
                <Form action="update">
                    <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">Rediger</button>
                </Form>
                <Form action="destroy" method="post" onSubmit={confirmDelete}>
                    <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">Slet</button>
                </Form>
                </>
                )}
            </div>
        </div>
    );
}