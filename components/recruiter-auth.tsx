"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function RecruiterAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/recruiter",
      redirect: false
    });

    if (result?.error) {
      setError("Invalid credentials");
    } else if (result?.url) {
      window.location.href = result.url;
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-md space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Recruiter Sign In</h2>
        <p className="text-sm text-white/60">
          Recruiter accounts are invite-only for the MVP.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Recruiter email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Card>
  );
}
