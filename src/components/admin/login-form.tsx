"use client";

import { useActionState } from "react";
import { buttonClass } from "@/components/ui/button";
import { login, type LoginState } from "@/lib/admin/actions";
import { inputClass } from "./fields";

export function LoginForm({ notice }: { notice: string | null }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {
    error: null,
  });
  const message = state.error ?? notice;

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <p role="alert" className="min-h-5 text-sm text-accent-text">
        {message}
      </p>
      <button
        type="submit"
        disabled={pending}
        className={buttonClass("primary", "lg", "w-full")}
      >
        {pending ? "Masuk…" : "Masuk"}
      </button>
    </form>
  );
}
