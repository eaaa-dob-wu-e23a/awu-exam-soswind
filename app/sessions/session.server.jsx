import { createCookieSessionStorage } from "@remix-run/node";


export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "remix-session",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secrets: ["dont-tell-anyone"],
    },
});

export let { getSession, commitSession, destroySession } = sessionStorage;

