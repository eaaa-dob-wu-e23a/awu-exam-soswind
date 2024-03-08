import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { auth } from "../sessions/auth.server";
import mongoose from "mongoose";
import { json, redirect } from "@remix-run/node";



export async function loader({ request, params }) {

    await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    const event = await mongoose.models.Event.findById(params.eventId).populate("createdBy");
    
    return json({ event });
}



export default function EventsPostIdUpdate() {
    const { event } = useLoaderData();
    const navigate = useNavigate();

    function handleCancel(e) {
        e.preventDefault();
        navigate(`/events`);
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Rediger event</h2>
    
                <Form method="post" id="edit-event-form" className="mt-8 space-y-4">
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="title" className="sr-only">Titel</label>
                            <input id="title" name="title" type="text" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg" placeholder="Titel" defaultValue={event ? event.title : ''} />
                        </div>
                        <div>
                            <label htmlFor="description" className="sr-only">Beskrivelse</label>
                            <input id="description" name="description" type="text" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg" placeholder="Beskrivelse" defaultValue={event ? event.description : ''} />
                        </div>
                        <div>
                            <label htmlFor="date" className="sr-only">Dato</label>
                            <input id="date" name="date" type="date" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg" defaultValue={event ? event.date : ''} />
                        </div>
                        <div>
                            <label htmlFor="time" className="sr-only">Tidspunkt</label>
                            <input id="time" name="time" type="time" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg" defaultValue={event ? event.time : ''} />
                        </div>
                        <div>
                            <label htmlFor="location" className="sr-only">Lokation</label>
                            <input id="location" name="location" type="text" required className="aappearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg" placeholder="Lokation" defaultValue={event ? event.location : ''} />
                        </div>
                        <div>
                            <label htmlFor="price" className="sr-only">Pris i kr.</label>
                            <input id="price" name="price" type="number" required className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg" placeholder="Pris i kr." defaultValue={event ? event.price : ''} />
                        </div>
                    </div>
    
                    <div className="flex flex-col items-center justify-between space-y-4">
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-m font-semibold rounded-md text-white bg-orange-600 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2">
                            Gem ændringer
                        </button>
                        <button type="button" className="mt-3 group relative w-full flex justify-center py-2 px-4 border border-transparent text-m font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2" onClick={handleCancel}>
                            Annuller
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );

}



export async function action({ request, params }) {

    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    const eventToUpdate = await mongoose.models.Event.findById(params.eventId);

    if (!eventToUpdate.createdBy.toString() === user._id.toString()) {
        return redirect(`/events/${params.eventId}`);
    }


    const formData = await request.formData();
    const event = Object.fromEntries(formData);

    eventToUpdate.title = event.title;
    eventToUpdate.description = event.description;
    eventToUpdate.date = event.date;
    eventToUpdate.time = event.time;
    eventToUpdate.location = event.location;
    eventToUpdate.price = event.price;

    await eventToUpdate.save();

    return redirect(`/events/${params.eventId}`);

}