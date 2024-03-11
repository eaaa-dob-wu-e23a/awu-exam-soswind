import { sessionStorage } from "./session.server";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export let auth = new Authenticator(sessionStorage, {
  sessionErrorKey: "authError",
});

auth.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email").toLowerCase();
    let password = form.get("password");
    let confirmPassword = form.get("confirmPassword");

    // do some validation, errors are saved in the sessionErrorKey
    if (!email || typeof email !== "string" || !email.trim()) {
      throw new AuthorizationError("Email er påkrævet");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new AuthorizationError("Email er ikke gyldig");
    }

    if (!password || typeof password !== "string" || !password.trim()) {
      throw new AuthorizationError("Password er påkrævet");
    }

    if (password !== confirmPassword) {
      throw new AuthorizationError("Passwords matcher ikke");
    }

    const existingUser = await mongoose.models.User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      throw new AuthorizationError("En bruger med denne email findes allerede");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await mongoose.models.User.create({
      email,
      password: hashedPassword,
    });

    user.password = undefined;
    return user;
  }),
  "user-signup",
);

auth.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    const user = await verifyUser({ email, password });
    if (!user) {
      throw new AuthorizationError("Brugeren findes ikke");
    }

    return user;
  }),
  "user-pass",
);

async function verifyUser({ email, password }) {
  const user = await mongoose.models.User.findOne({ email }).select(
    "+password",
  );
  if (!user) {
    throw new AuthorizationError(
      "Ingen bruger fundet med denne email. Prøv igen",
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthorizationError("Forkert password. Prøv igen");
  }

  user.password = undefined;
  return user;
}
