import { Form, useNavigate } from "@remix-run/react";
import { auth } from "../sessions/auth.server";
import mongoose from "mongoose";
import { json, redirect } from "@remix-run/node";
import { useTheme } from "../context/ThemeContext";

export async function loader({ request }) {
  await auth.isAuthenticated(request, {
    failureRedirect: "/signin",
  });
  return {};
}

export default function AddEvent() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  function handleCancel(e) {
    e.preventDefault();
    navigate("/events");
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen py-6 sm:px-6 lg:px-8 ${isDarkMode ? "bg-dark text-light" : "bg-light-DEFAULT text-dark"}`}
    >
      <div className="max-w-md w-full space-y-6">
        <h1 className="mt-6 text-center text-3xl font-extrabold">
          Opret event
        </h1>

        <Form method="post" id="event-form" className="mt-8 space-y-4">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="title" className="sr-only">
                Titel på event
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg"
                placeholder="Titel på event"
              />
            </div>

            <div>
              <label htmlFor="description" className="sr-only">
                Beskrivelse
              </label>
              <textarea
                id="description"
                name="description"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg"
                placeholder="Beskrivelse"
              ></textarea>
            </div>

            <div>
              <label htmlFor="date" className="sr-only">
                Dato
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg"
              />
            </div>

            <div>
              <label htmlFor="time" className="sr-only">
                Tidspunkt
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg"
              />
            </div>

            <div>
              <label htmlFor="location" className="sr-only">
                Lokation
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg"
                placeholder="Lokation"
              />
            </div>

            <div>
              <label htmlFor="price" className="sr-only">
                Pris
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-black-300 placeholder-black-500 text-black rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 text-lg"
                placeholder="Pris i kr."
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-m font-semibold rounded-md text-white bg-orange-600 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Opret event
            </button>
            <button
              type="reset"
              className="mt-3 group relative w-full flex justify-center py-2 px-4 border border-transparent text-m font-semibold rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={handleCancel}
            >
              Annuller
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const formData = await request.formData();
  const event = Object.fromEntries(formData);

  event.createdBy = user._id;

  try {
    const newEvent = await mongoose.models.Event.create(event);

    const userDoc = await mongoose.models.User.findById(user._id);

    userDoc.events.push(newEvent._id);
    await userDoc.save();

    return redirect(`/events/${newEvent._id}`);
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);

    return json(
      { error: "An error occurred while creating the event" },
      { status: 500 },
    );
  }
}
