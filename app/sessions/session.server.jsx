import { createCookieSessionStorage } from "@remix-run/node";


export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "remix-session",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: ["dont-tell-anyone"],
        secure: process.env.NODE_ENV === "production", // enable this in prod only

    },
});

export let { getSession, commitSession, destroySession } = sessionStorage;

