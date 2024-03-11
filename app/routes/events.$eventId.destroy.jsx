import mongoose from "mongoose";
import { auth } from "../sessions/auth.server";
import { redirect } from "@remix-run/node";


export async function loader({ request }) {

    await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    return {}

}


export async function action({ request, params }) {

    const user = await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    }); 

    const eventToDelete = await mongoose.models.Event.findById(params.eventId);

    if (eventToDelete.createdBy.toString() !== user._id.toString()) {
        return redirect(`/events/${params.eventId}`);
    }

    await mongoose.models.Event.findByIdAndDelete(params.eventId);
    
    return redirect("/events");
}


