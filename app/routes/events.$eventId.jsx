import { auth } from "../sessions/auth.server";
import mongoose from "mongoose";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useTheme } from "../context/ThemeContext";

export async function loader({ request, params }) {
  let authUser = null;
  try {
    authUser = await auth.isAuthenticated(request);
  } catch (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }

  if (!params.eventId) {
    console.error("No event id found in loader");
    return json({ event: null, authUser });
  }

  let event = null; 
    try {

    event = await mongoose.models.Event.findById(params.eventId)
    .populate("createdBy")
    .populate("attendees");
    } catch (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
    }
    return json({ event, authUser });
}

export default function Event() {
  const { event, authUser } = useLoaderData();
  const { isDarkMode } = useTheme();

  if (!event || !event.attendees) {
    return <div>No event or attendees found</div>;
  }

  const attendeeIds = event.attendees.map((attendee) =>
    attendee._id.toString(),
  );

  function confirmDelete(e) {
    if (!confirm("Er du sikker på at du vil slette dette event?")) {
      e.preventDefault();
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen py-6 sm:px-6 lg:px-8 ${isDarkMode ? "bg-dark text-dark" : "bg-light-DEFAULT text-dark"}`}
    >
      <div className="max-w-md w-full space-y-6 p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <h1 className="mt-6 text-center text-3xl font-extrabold">
          {event.title}
        </h1>
        <p className="mt-2 text-center font-semibold text-m">
          {new Date(event.date).toLocaleDateString()} kl. {event.time}
        </p>
        <p className="mt-2 text-center font-semibold text-lg">
          {event.location}
        </p>
        <p className="mt-2 text-center text-m font-semibold">
          {event.price} kr.
        </p>
        <p className="mt-2 text-center text-lg font-semibold">
          {event.description}
        </p>
        <p className="mt-2 text-center text-m font-semibold">
          {authUser && (
            <p className="mt-2 text-center text-m font-semibold">
              Oprettet af:{" "}
              {authUser._id === event.createdBy._id
                ? "dig"
                : event.createdBy.username}
            </p>
          )}

          {authUser && authUser._id !== event.createdBy._id && (
            <div className="flex justify-center mt-4">
              {attendeeIds.includes(authUser._id) ? (
                <Form action="unRegister" method="post">
                  <button className="w-full bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">
                    Afmeld event
                  </button>
                </Form>
              ) : (
                <Form method="post">
                  <button className="w-full bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">
                    Tilmeld dig
                  </button>
                </Form>
              )}
            </div>
          )}

          <div>
            <p className="mt-2 text-center text-m font-semibold text-black-500">
              Deltagere:
            </p>
            <ul>
              {event.attendees.map((attendee, index) => (
                <li key={index}>{attendee.username}</li>
              ))}
            </ul>
          </div>

          {!authUser && (
            <div className="flex flex-col justify-center mt-4 py-6">
              <p className="font-bold text-center">
                Ønsker du at tilmelde dig eventet?
              </p>
              <p className="font-bold text-center py-2">
                Opret en profil og tilmeld dig!
              </p>
              <Form action="/signup">
                <button className="w-full bg-orange-600 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mt-4">
                  Opret profil
                </button>
              </Form>
            </div>
          )}

          {authUser &&
            authUser._id &&
            event.createdBy &&
            event.createdBy._id &&
            authUser._id === event.createdBy._id && (
              <div className="flex flex-col items-center">
                <Form action="update">
                  <button className="m-4 bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">
                    Rediger event
                  </button>
                </Form>

                <Form action="destroy" method="post" onSubmit={confirmDelete}>
                  <button className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">
                    Slet event
                  </button>
                </Form>
              </div>
            )}
        </p>
      </div>
    </div>
  );
}

// Sikrer, at en bruger kan tilmelde sig et event, og kun hvis brugeren er logget ind.
// Sikrer også at brugeren kun kan tilmelde sig et event én gang.

export async function action({ request, params }) {
    let authUser = null;

    try {
        authUser = await auth.isAuthenticated(request, {
            failureRedirect: "/signin",
        });
    } catch (error) {
        console.error(error);
        return json({ error: error.message }, { status: 500 });
    }

    let user = null;
    try {
        user = await mongoose.models.User.findById(authUser._id);
    } catch (error) {
        console.error(error);
        return json({ error: error.message }, { status: 500 });
    }


    let event = null;
    try {
        event = await mongoose.models.Event.findById(params.eventId);
    } catch (error) {
        console.error(error);
        return json({ error: error.message }, { status: 500 });
    }


  if (!event) {
    return json({ error: "Event not found" }, { status: 404 });
  }

  if (!Array.isArray(event.attendees)) {
    event.attendees = [];
  }
  if (
    !event.attendees.map((id) => id.toString()).includes(user._id.toString())
  ) {
    event.attendees.push(user._id);
  }

  if (!Array.isArray(user.registeredEvents)) {
    user.registeredEvents = [];
  }
  if (
    !user.registeredEvents
      .map((event) => event.toString())
      .includes(event._id.toString())
  ) {
    user.registeredEvents.push(event._id);
  }

  try {
    await event.save();
    await user.save();
  } catch (error) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }

  return redirect(`/events/${event._id}`);
}
