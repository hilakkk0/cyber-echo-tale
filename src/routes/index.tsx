import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neon Protocol — İnteraktif Macera" },
      { name: "description", content: "Karanlık, siberpunk esintili bir seçim tabanlı macera oyunu." },
      { property: "og:title", content: "Neon Protocol" },
      { property: "og:description", content: "Karanlık, siberpunk esintili bir seçim tabanlı macera oyunu." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Game />;
}
