import { sessionStorage } from "../sessions/session.server";
import { redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { auth } from "../sessions/auth.server";
import { json } from "@remix-run/node";


export async function loader({ request }) {

    await sessionStorage.getSession(request.headers.get("Cookie"));

    const { eventId } = request.params;

    return ({ eventId});
};

// Sikrer, at brugeren kan afmelde sig et event igen. 

export async function action({ request, params }) {
    const authUser = await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    await sessionStorage.getSession(request.headers.get("Cookie"));


    const user = await mongoose.models.User.findById(authUser._id);

    const event = await mongoose.models.Event.findById(params.eventId);

    if (!event) {
        return json({ error: 'Event not found' }, { status: 404 });
    }

    event.attendees = event.attendees.filter(id => id.toString() !== user._id.toString());

    user.registeredEvents = user.registeredEvents.filter(id => id.toString() !== event._id.toString());

    await event.save();
    await user.save();

    return redirect(`/events/${event._id}`);

}







