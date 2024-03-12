import { Form } from "@remix-run/react";
import { auth } from "../sessions/auth.server";
import { useLoaderData } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export async function loader({ request }) {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/signin",
  });

  const userData = await mongoose.models.User.findById(user._id)
    .populate("events")
    .populate("registeredEvents");

  return { data: userData };
}

export default function Profile() {
  const { data: user } = useLoaderData();
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  async function handleUnregister(eventId) {
    setLoading(true);
    try {
      const response = await fetch(`/events/${eventId}/unregister`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        console.log("Successfully unregistered from event:", eventId);
        
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div
      className={`flex flex-col items-center justify-start h-screen p-10 ${isDarkMode ? "bg-dark text-dark" : "bg-light text-dark"}`}
    >
      <div className="flex w-full mb-4">
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg mr-4">
          <h1 className="text-2xl font-bold mb-4">Dine oplysninger</h1>
          <h2 className="text-xl font-semibold mb-2">Brugeroplysninger</h2>
          <p className="mb-2">
            <strong>Navn:</strong> {user.username}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <div className="flex-grow w-2/3 bg-white p-6 rounded-lg shadow-lg flex">
          <div className="w-1/2 pr-2">
            <h1 className="text-2xl font-bold mb-4 py-2">
              Events oprettet af dig
            </h1>
            <ul className="list-disc list-inside">
              {user.events.map((event, index) => (
                <li key={index} className="mb-2">
                  <a
                    className="font-semibold text-lg hover:text-gray-500"
                    href={`/events/${event._id}`}
                  >
                    {event.title}
                    <br></br>
                    {event.location}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 pr-2">
            <h2 className="text-2xl font-semibold mb-4 py-2">
              Events du er tilmeldt
            </h2>
            <ul className="list-disc list-inside">
              {user.registeredEvents &&
                user.registeredEvents.map((event, index) => (
                  <li key={index} className="mb-2">
                    <a
                      className="font-semibold text-lg hover:text-gray-500"
                      href={`/events/${event._id}`}
                    >
                      {event.title}
                      <br></br>
                      {event.location}
                    </a>

                    <button
                      className="bg-red-600 text-white font-semibold p-2 ml-2 rounded-lg hover:bg-red-400"
                      onClick={() => handleUnregister(event._id)}
                      disabled={loading}
                    >
                      Afmeld
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <Form method="post" className="w-full flex justify-end pr-10 pb-4">
        <button type="submit" className="bg-orange-600 text-white font-semibold p-4 rounded-lg hover:bg-orange-400">
          Log ud
        </button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  await auth.logout(request, { redirectTo: "/signin" });
  console.log("User has been logged out");
  return new Response("Logged out", { status: 200 });
}
