import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Odaa Play" }],
  }),
  component: Home,
});

function Home() {
  return <Navigate to="/quests" search={{}} replace />;
}
