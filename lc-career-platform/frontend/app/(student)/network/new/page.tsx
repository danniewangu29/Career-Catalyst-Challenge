"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import NetworkForm, {
  NetworkFormValues,
} from "@/components/network-form";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function AddConnectionPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function createConnection(
    values: NetworkFormValues,
  ) {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/network-connections`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            organization: values.organization || null,
            role: values.role || null,
            email: values.email || null,
            phone: values.phone || null,
            relationship_type: values.relationship_type,
            status: values.status,
            last_contact_date:
              values.last_contact_date || null,
            follow_up_date: values.follow_up_date || null,
            notes: values.notes || null,
          }),
        },
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        let message =
          "The connection could not be saved.";

        if (typeof result?.detail === "string") {
          message = result.detail;
        } else if (Array.isArray(result?.detail)) {
          message = result.detail
            .map((item: { msg?: string }) => item.msg)
            .filter(Boolean)
            .join(" ");
        }

        throw new Error(message);
      }

      router.push("/network");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <NetworkForm
      title="Add a professional connection"
      description="Record who you met, how they connect with your goals, and when you plan to continue the conversation."
      submitLabel="Save connection"
      submittingLabel="Saving connection..."
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={createConnection}
    />
  );
}