import { auth } from "../sessions/auth.server";
import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { sessionStorage } from "../sessions/session.server";
import { useState } from "react";

export async function loader({ request, params }) {

    let authUser = null;
        try {
            authUser = await auth.isAuthenticated(request);
        } catch (error) {
            console.error(error);
        }
    if (!params.eventId) {
        console.error("No event id found in loader");
        return json({ event: null, authUser });
    }

    const event = await mongoose.models.Event.findById(params.eventId).populate("createdBy").populate("attendees");
    return json ({ event, authUser });
}

export default function Event() {
    const { event, authUser } = useLoaderData();

    const attendeeIds = event.attendees.map(attendee => attendee._id.toString());

    function confirmDelete(e) {
        if (!confirm("Er du sikker på at du vil slette dette event?")) {
            e.preventDefault();
        }
    }


    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">

            <div className="max-w-md w-full space-y-6 p-6 bg-white shadow-md rounded-lg border border-gray-200">
                <h1 className="mt-6 text-center text-3xl font-extrabold text-black-500">{event.title}</h1>
                <p className="mt-2 text-center font-semibold text-m text-black-500">{new Date (event.date).toLocaleDateString()} kl. {event.time}</p>
                <p className="mt-2 text-center font-semibold text-lg text-black-500">{event.location}</p>
                <p className="mt-2 text-center text-m font-semibold text-black-500">{event.price} kr.</p>
                <p className="mt-2 text-center text-lg font-semibold text-black-500">{event.description}</p>
                <p className="mt-2 text-center text-m font-semibold text-black-500">
                
                {authUser && (
                    <p className="mt-2 text-center text-m font-semibold text-black-500">
                        Oprettet af: {authUser._id === event.createdBy._id ? "dig" : event.createdBy.username}
                     </p>
                    )}

                {authUser && authUser._id !== event.createdBy._id && (
    <div className="flex justify-center mt-4">
                {attendeeIds.includes(authUser._id) ? (
            <Form action="unRegister" method="post">
                <button className="w-full bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">Afmeld event</button>
            </Form>
        ) : (
            <Form method="post">
                <button className="w-full bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">Tilmeld dig</button>
            </Form>
        )}
    </div>
    )}

            <div>
                <p className="mt-2 text-center text-m font-semibold text-black-500">Deltagere:</p>
                <ul>
                    {event.attendees.map((attendee, index) => (
                        <li key={index}>{attendee.username}</li>
                    ))}
                </ul>
                </div>

                {!authUser && (

                    <div className="flex flex-col justify-center mt-4 py-6">
                    <p className="font-bold text-center">Ønsker du at tilmelde dig eventet?</p>
                    <p className="font-bold text-center py-2">Opret en profil og tilmeld dig!</p>
                    <Form action="/signup">
                        <button className="w-full bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">Opret profil</button>
                     </Form>
                 </div>
                )}


{authUser && authUser._id && event.createdBy && event.createdBy._id && authUser._id === event.createdBy._id && (

                    <div className="flex flex-col items-center">
                    <Form action="update">
                        <button className="m-4 bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">Rediger event</button>
                    </Form>

                    <Form action="destroy" method="post" onSubmit={confirmDelete}>
                        <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">Slet event</button>
                    </Form>
                </div>

                )}
            </p>
            </div>

        </div>
    );
}

// Action sikrer, at en bruger kan tilmelde sig et event, og kun hvis brugeren er logget ind.
// Sikrer også at brugeren kun kan tilmelde sig et event én gang.

export async function action({ request, params }) {
    const authUser = await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    const user = await mongoose.models.User.findById(authUser._id);

    const event = await mongoose.models.Event.findById(params.eventId);

    if (!event) {
        return json({ error: 'Event not found' }, { status: 404 });
    }

    if (!Array.isArray(event.attendees)) {
        event.attendees = [];
    }
    if (!event.attendees.map(id => id.toString()).includes(user._id.toString())) {
        event.attendees.push(user._id);
    }

    if (!Array.isArray(user.registeredEvents)) {
        user.registeredEvents = [];
    }
    if (!user.registeredEvents.map(event => event.toString()).includes(event._id.toString())) {
        user.registeredEvents.push(event._id);
    }

    await event.save();
    await user.save();

    return redirect(`/events/${event._id}`);
}