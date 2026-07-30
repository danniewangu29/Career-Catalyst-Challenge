"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import NetworkForm, {
  NetworkFormValues,
} from "@/components/network-form";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type NetworkConnection = {
  id?: string;
  connection_id?: string;
  name: string;
  organization: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  relationship_type?: string | null;
  status?: string | null;
  last_contact_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
};

export default function EditNetworkConnectionPage() {
  const router = useRouter();
  const params = useParams();

  const connectionId =
    typeof params.Id === "string"
      ? params.Id
      : typeof params.id === "string"
        ? params.id
        : typeof params.ConnectionId === "string"
          ? params.ConnectionId
          : typeof params.connectionId === "string"
            ? params.connectionId
            : null;

  const [connection, setConnection] =
    useState<NetworkConnection | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!connectionId) {
      setError("The connection identifier is missing.");
      setIsLoading(false);
      return;
    }

    async function loadConnection() {
      try {
        const response = await fetch(
          `${API_URL}/api/network-connections/${connectionId}`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            typeof result?.detail === "string"
              ? result.detail
              : "The network connection could not be loaded.",
          );
        }

        setConnection(result);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadConnection();
  }, [connectionId]);

  async function updateConnection(
    values: NetworkFormValues,
  ) {
    if (!connectionId) {
      setError("The connection identifier is missing.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/network-connections/${connectionId}`,
        {
          method: "PATCH",
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
          "The network connection could not be updated.";

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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-56 animate-pulse rounded-[1.75rem] bg-slate-200/70" />
        <div className="h-[42rem] animate-pulse rounded-[1.75rem] bg-slate-200/70" />
      </div>
    );
  }

  if (!connection) {
    return (
      <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-red-200 bg-red-50 p-8 text-center">
        <h1 className="text-2xl font-black text-red-950">
          Connection unavailable
        </h1>

        <p className="mt-3 text-sm leading-6 text-red-800">
          {error ||
            "The requested network connection could not be found."}
        </p>

        <Link
          href="/network"
          className="mt-6 inline-flex rounded-xl bg-[#102a43] px-5 py-3 text-sm font-black text-white"
        >
          Return to network
        </Link>
      </section>
    );
  }

  return (
    <NetworkForm
      title={`Edit ${connection.name}`}
      description="Update the contact details, relationship status, private notes, and your next follow-up plan."
      submitLabel="Save changes"
      submittingLabel="Saving changes..."
      initialValues={{
        name: connection.name,
        organization: connection.organization ?? "",
        role: connection.role ?? "",
        email: connection.email ?? "",
        phone: connection.phone ?? "",
        relationship_type: [
          "mentor",
          "recruiter",
          "alumni",
        ].includes(connection.relationship_type ?? "")
          ? connection.relationship_type ?? "mentor"
          : "mentor",
        status: [
          "new",
          "follow_up_needed",
          "active",
          "inactive",
        ].includes(connection.status ?? "")
          ? connection.status ?? "new"
          : "new",
        last_contact_date:
          connection.last_contact_date ?? "",
        follow_up_date: connection.follow_up_date ?? "",
        notes: connection.notes ?? "",
      }}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={updateConnection}
    />
  );
}