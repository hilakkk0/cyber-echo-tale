import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const rawBase = import.meta.env.BASE_URL ?? "/";
const isSubpathDeploy = rawBase !== "/" && rawBase !== "./";
const basepath = isSubpathDeploy ? rawBase.replace(/\/$/, "") : "/";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath,
    ...(isSubpathDeploy ? { trailingSlash: "always" as const } : {}),
  });

  return router;
};
