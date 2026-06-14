import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/mitarbeiter")({
  head: () => ({ meta: [{ title: "Mitarbeiterbereich – EnergieClever" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => <Outlet />,
});
