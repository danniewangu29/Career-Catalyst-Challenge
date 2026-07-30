"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

function getConnectionId(connection: NetworkConnection) {
  return connection.id ?? connection.connection_id;
}

function formatLabel(value?: string | null) {
  if (!value) {
    return "Not specified";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function NetworkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M14.5 15.5A4.5 4.5 0 0 1 21 19" />
    </svg>
  );
}

export default function NetworkPage() {
  const [connections, setConnections] = useState<
    NetworkConnection[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [deletingConnectionId, setDeletingConnectionId] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConnections() {
      try {
        const response = await fetch(
          `${API_URL}/api/network-connections`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Your network connections could not be loaded.",
          );
        }

        const result: NetworkConnection[] =
          await response.json();

        setConnections(result);
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

    loadConnections();
  }, []);

  async function deleteConnection(
    connection: NetworkConnection,
  ) {
    const connectionId = getConnectionId(connection);

    if (!connectionId) {
      setError("This connection is missing its identifier.");
      return;
    }

    const confirmed = window.confirm(
      `Delete "${connection.name}" from your network?`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingConnectionId(connectionId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/network-connections/${connectionId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
          typeof result?.detail === "string"
            ? result.detail
            : "The connection could not be deleted.",
        );
      }

      setConnections((currentConnections) =>
        currentConnections.filter(
          (currentConnection) =>
            getConnectionId(currentConnection) !== connectionId,
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong.",
      );
    } finally {
      setDeletingConnectionId(null);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const followUpsDue = useMemo(
    () =>
      connections
        .filter(
          (connection) =>
            connection.follow_up_date !== null &&
            connection.follow_up_date <= today,
        )
        .sort((first, second) =>
          String(first.follow_up_date).localeCompare(
            String(second.follow_up_date),
          ),
        ),
    [connections, today],
  );

  const activeConnections = useMemo(
    () =>
      connections.filter(
        (connection) =>
          connection.status === "active" ||
          connection.status === "connected",
      ).length,
    [connections],
  );

  const contactsWithEmail = useMemo(
    () =>
      connections.filter(
        (connection) => connection.email !== null,
      ).length,
    [connections],
  );

  return (
    <div>
      <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#102a43] via-[#15576a] to-[#1f9d91] px-6 py-8 text-white shadow-[0_26px_70px_rgba(16,42,67,0.25)] sm:px-8 sm:py-10">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#58c5d8]/30 blur-3xl" />
        <div className="absolute -bottom-28 left-[38%] h-64 w-64 rounded-full bg-[#ef8354]/20 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#b7f2ec]">
              <span className="h-2 w-2 rounded-full bg-[#78ded3]" />
              Grow your community
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Relationships can open doors—and offer direction.
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              Keep track of mentors, alumni, professors, recruiters,
              employers, and other people supporting your professional
              growth.
            </p>
          </div>

          <Link
            href="/network/new"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-5 text-sm font-black text-[#102a43] shadow-xl hover:-translate-y-0.5 hover:bg-[#effaf8]"
          >
            Add connection
            <span className="ml-2 text-xl">+</span>
          </Link>
        </div>
      </section>

      {isLoading && (
        <div className="mt-7 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-[1.5rem] bg-slate-200/70"
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800 shadow-sm"
        >
          <p className="font-black">
            Your network could not be loaded
          </p>

          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && connections.length === 0 && (
        <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-dashed border-[#b9cdd2] bg-gradient-to-br from-white via-[#f9fcfc] to-[#e5f6f3] p-8 text-center shadow-[0_18px_45px_rgba(16,42,67,0.08)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102a43] to-[#1f9d91] text-white shadow-lg">
            <NetworkIcon />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
            Start building your network
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43] sm:text-3xl">
            Add someone who has supported your growth.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#607884]">
            Begin with a professor, alumnus, mentor, supervisor,
            recruiter, employer, classmate, or professional contact.
          </p>

          <Link
            href="/network/new"
            className="mt-7 inline-flex rounded-xl bg-[#1f9d91] px-5 py-3 text-sm font-black text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#17877d]"
          >
            Add your first connection
          </Link>
        </section>
      )}

      {!isLoading && !error && connections.length > 0 && (
        <>
          <section
            aria-label="Network summary"
            className="mt-7 grid gap-4 sm:grid-cols-3"
          >
            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#1f9d91]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Total connections
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-4xl font-black tracking-tight text-[#102a43]">
                  {connections.length}
                </p>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff5f1] text-[#16776e]">
                  <NetworkIcon />
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#ef8354]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Follow-ups due
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-4xl font-black tracking-tight text-[#102a43]">
                  {followUpsDue.length}
                </p>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e8] text-[#d56438]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                </div>
              </div>
            </article>

            <article className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_12px_35px_rgba(16,42,67,0.08)] backdrop-blur">
              <div className="absolute inset-x-0 top-0 h-1 bg-[#58c5d8]" />

              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#718792]">
                Active relationships
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black tracking-tight text-[#102a43]">
                    {activeConnections}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#8a9da8]">
                    {contactsWithEmail} with email recorded
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e5f4fb] text-[#267ca0]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M8 12.5 10.5 15 16 9.5" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
              </div>
            </article>
          </section>

          {followUpsDue.length > 0 && (
            <section className="mt-7 rounded-[1.5rem] border border-[#efdca7] bg-gradient-to-r from-[#fff9e9] to-[#fff2cf] p-6 shadow-[0_15px_42px_rgba(126,94,24,0.08)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a711c]">
                    Keep relationships moving
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                    Professional follow-ups are due.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#765f2e]">
                    A timely thank-you, update, or check-in can help
                    maintain the relationship.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {followUpsDue.slice(0, 3).map((connection) => (
                    <span
                      key={
                        getConnectionId(connection) ??
                        connection.name
                      }
                      className="rounded-full border border-white bg-white/75 px-4 py-2 text-sm font-black text-[#7c611f]"
                    >
                      {connection.name}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="mt-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#1f9d91]">
                  Your professional community
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#102a43]">
                  Recorded connections
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#718792]">
                  Review relationship status, contact information,
                  notes, and next follow-up dates.
                </p>
              </div>

              <Link
                href="/network/new"
                className="rounded-xl border border-[#cbdcdf] bg-white px-4 py-2.5 text-sm font-black text-[#16697a] shadow-sm hover:border-[#1f9d91] hover:bg-[#effaf8]"
              >
                Add another connection
              </Link>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {connections.map((connection, index) => {
                const connectionId =
                  getConnectionId(connection);

                const followUpIsDue =
                  connection.follow_up_date !== null &&
                  connection.follow_up_date <= today;

                const accents = [
                  {
                    gradient:
                      "from-[#102a43] to-[#1f9d91]",
                    avatar:
                      "bg-[#dff5f1] text-[#16776e]",
                  },
                  {
                    gradient:
                      "from-[#256d85] to-[#58c5d8]",
                    avatar:
                      "bg-[#e5f4fb] text-[#267ca0]",
                  },
                  {
                    gradient:
                      "from-[#d56438] to-[#ef8354]",
                    avatar:
                      "bg-[#fff0e8] text-[#d56438]",
                  },
                  {
                    gradient:
                      "from-[#6f5aad] to-[#8b72d5]",
                    avatar:
                      "bg-[#ede9fe] text-[#6d55b8]",
                  },
                ];

                const accent =
                  accents[index % accents.length];

                const initials = connection.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase())
                  .join("");

                return (
                  <article
                    key={connectionId ?? connection.name}
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 shadow-[0_15px_42px_rgba(16,42,67,0.09)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(16,42,67,0.15)]"
                  >
                    <div
                      className={`h-1.5 bg-gradient-to-r ${accent.gradient}`}
                    />

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${accent.avatar}`}
                          >
                            {initials || "?"}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-xl font-black tracking-tight text-[#102a43]">
                              {connection.name}
                            </h3>

                            {(connection.role ||
                              connection.organization) && (
                              <p className="mt-1 text-sm font-semibold text-[#607884]">
                                {[
                                  connection.role,
                                  connection.organization,
                                ]
                                  .filter(Boolean)
                                  .join(" at ")}
                              </p>
                            )}

                            <p className="mt-2 text-xs font-bold text-[#8a9da8]">
                              {formatLabel(
                                connection.relationship_type,
                              )}
                            </p>
                          </div>
                        </div>

                        <span className="rounded-full bg-[#edf4f5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#526b78]">
                          {formatLabel(connection.status)}
                        </span>
                      </div>

                      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl bg-[#f7fbfb] p-4">
                          <dt className="text-xs font-black uppercase tracking-[0.1em] text-[#607884]">
                            Last contact
                          </dt>

                          <dd className="mt-2 text-sm font-bold text-[#102a43]">
                            {formatDate(
                              connection.last_contact_date,
                            ) ?? "Not recorded"}
                          </dd>
                        </div>

                        <div
                          className={[
                            "rounded-2xl p-4",
                            followUpIsDue
                              ? "border border-[#efc3b4] bg-[#fff4ef]"
                              : "bg-[#f7fbfb]",
                          ].join(" ")}
                        >
                          <dt
                            className={[
                              "text-xs font-black uppercase tracking-[0.1em]",
                              followUpIsDue
                                ? "text-[#c6532d]"
                                : "text-[#607884]",
                            ].join(" ")}
                          >
                            Follow-up
                          </dt>

                          <dd
                            className={[
                              "mt-2 text-sm font-bold",
                              followUpIsDue
                                ? "text-[#b94f2a]"
                                : "text-[#102a43]",
                            ].join(" ")}
                          >
                            {formatDate(
                              connection.follow_up_date,
                            ) ?? "Not scheduled"}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-5 rounded-2xl border border-[#e3ecee] bg-white p-4">
                        <p className="text-xs font-black uppercase tracking-[0.1em] text-[#1f9d91]">
                          Contact information
                        </p>

                        <div className="mt-3 space-y-2 text-sm">
                          {connection.email && (
                            <a
                              href={`mailto:${connection.email}`}
                              className="block break-words font-semibold text-[#16697a] hover:underline"
                            >
                              {connection.email}
                            </a>
                          )}

                          {connection.phone && (
                            <a
                              href={`tel:${connection.phone}`}
                              className="block font-semibold text-[#16697a] hover:underline"
                            >
                              {connection.phone}
                            </a>
                          )}

                          {!connection.email &&
                            !connection.phone && (
                              <p className="italic text-[#8a9da8]">
                                No contact details recorded.
                              </p>
                            )}
                        </div>
                      </div>

                      {connection.notes ? (
                        <div className="mt-5 rounded-2xl border border-[#e4dff3] bg-[#f8f6fc] p-4">
                          <p className="text-xs font-black uppercase tracking-[0.1em] text-[#6f5aad]">
                            Relationship notes
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#5f5970]">
                            {connection.notes}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-5 rounded-2xl border border-dashed border-[#d3e1e4] bg-[#fafcfc] p-4">
                          <p className="text-sm italic text-[#8a9da8]">
                            Add conversation notes, shared interests,
                            advice, or next steps.
                          </p>
                        </div>
                      )}

                      <div className="mt-auto flex flex-wrap gap-3 border-t border-[#e3ecee] pt-5">
                        {connectionId ? (
                          <Link
                            href={`/network/${connectionId}/edit`}
                            className="inline-flex items-center justify-center rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#16697a]"
                          >
                            Edit connection
                          </Link>
                        ) : (
                          <span className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-black text-slate-500">
                            Identifier missing
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            deleteConnection(connection)
                          }
                          disabled={
                            !connectionId ||
                            deletingConnectionId === connectionId
                          }
                          className="inline-flex items-center justify-center rounded-xl border border-[#efc3b4] bg-white px-4 py-2.5 text-sm font-black text-[#c6532d] hover:border-[#ef8354] hover:bg-[#fff4ef] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingConnectionId === connectionId
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_15px_42px_rgba(16,42,67,0.08)] backdrop-blur sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ef8354]">
                Build relationships thoughtfully
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight text-[#102a43]">
                Networking works best when it is not transactional.
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-[#607884]">
                Stay curious, follow through on commitments, express
                appreciation, and look for ways to maintain genuine
                professional relationships over time.
              </p>

              <Link
                href="/resources"
                className="mt-6 inline-flex rounded-xl bg-[#1f9d91] px-4 py-2.5 text-sm font-black text-white hover:-translate-y-0.5 hover:bg-[#17877d]"
              >
                Explore networking resources
              </Link>
            </article>

            <article className="rounded-[1.5rem] bg-gradient-to-br from-[#102a43] to-[#16697a] p-6 text-white shadow-[0_20px_50px_rgba(16,42,67,0.22)] sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#78ded3]">
                Quick reflection
              </p>

              <h2 className="mt-3 text-xl font-black">
                Who could help you understand your next step?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Consider professors, alumni, supervisors, peers, and
                professionals whose experience connects with your
                questions.
              </p>

              <Link
                href="/network/new"
                className="mt-6 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#102a43] hover:-translate-y-0.5"
              >
                Add a connection
              </Link>
            </article>
          </section>
        </>
      )}
    </div>
  );
}