import mongoose from "mongoose";
import { auth } from "../sessions/auth.server";
import { redirect } from "@remix-run/node";


export async function loader({ request, params }) {
    await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    });

    return {}

}


export async function action({ request, params }) {

    await auth.isAuthenticated(request, {
        failureRedirect: "/signin",
    }); 

    await mongoose.models.Event.findByIdAndDelete(params.eventId);
    
    return redirect("/events");
}


