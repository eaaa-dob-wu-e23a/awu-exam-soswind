import { sessionStorage } from "./session.server";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";


export let auth = new Authenticator(sessionStorage);

auth.use(new FormStrategy(async ({ form }) => {
    let username = form.get("username");
    let email = form.get("email");
    let password = form.get("password");
    let user = null

    return user;

}),

"user-pass"
);