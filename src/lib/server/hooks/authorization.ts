import {type Handle, error, redirect} from "@sveltejs/kit";
import {Roles, type User} from "$types/db";
import hasRole from "$lib/utils/hasRole";

const authorization: Handle = async ({event, resolve}) => {
  // const user = event.locals.user;
  const user = event.locals.pb.authStore.record as unknown as User;
  event.locals.user = user;
  const path = event.url.pathname;
  const publicPaths = ["/", "/contacts", "/login"];

  if (publicPaths.includes(path)) {
    return await resolve(event);
  }

  console.log("user in authorization", user);
  if (!user) {
    redirect(302, "/");
  }

  const privateRoutes: Map<string, boolean> = new Map([
    ["/cogestione/registration", !hasRole(user, Roles.Staff, Roles.Docente)],
    ["/cogestione/ticket", !hasRole(user, Roles.Staff, Roles.Docente)],
    ["/cogestione/admin", hasRole(user, Roles.Admin)],
    ["/cogestione/classes", hasRole(user, Roles.Rappresentante, Roles.Admin)],
    [
      "/cogestione/activities",
      hasRole(user, Roles.Organizzatore, Roles.Admin, Roles.Docente),
    ],
    [
      "/cogestione/security",
      hasRole(user, Roles.Security, Roles.Staff, Roles.Admin),
    ],
    ["/cogestione/staff", hasRole(user, Roles.Staff, Roles.Admin)],
  ]);
  console.log("privateRoutes", privateRoutes);
  for (const [route, allowed] of privateRoutes) {
    if (path.startsWith(route) && !allowed) {
      redirect(302, "/cogestione");
    }
  }

  return await resolve(event);
};

export default authorization;
