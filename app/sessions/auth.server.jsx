import { sessionStorage } from "./session.server";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export let auth = new Authenticator(sessionStorage, {
    sessionErrorKey: "authError"
});

auth.use(new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    if (!email || email?.length === 0) {
        throw new Error("Email er påkrævet");
    }
    if (!password || password?.length === 0) {
        throw new Error("Password er påkrævet");
    }

    const User = mongoose.model("User");
    let user = await User.findOne({ email });

    if (!user) {
        throw new Error("Brugeren findes ikke");
    }

    const passwordMatch = bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("Forkert password eller email");
    }

    return user;

}), "user-pass");
