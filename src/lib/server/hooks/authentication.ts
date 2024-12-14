import {type Handle} from "@sveltejs/kit";

// TODO: Implement a real authentication system
const authentication: Handle = async ({event, resolve}) => {
  const pb = event.locals.pb;

  // console.log("authenticating...");

  // ! https://github.com/pocketbase/js-sdk?tab=readme-ov-file#ssr-integration
  // load the store data from the request cookie string
  // console.log("cookie", event.request.headers.get("cookie"));
  event.locals.pb.authStore.loadFromCookie(
    event.request.headers.get("cookie") || ""
  );
  // console.log("authStore", event.locals.pb.authStore);
  // console.log("authStore.isValid", event.locals.pb.authStore.isValid);
  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    event.locals.pb.authStore.isValid &&
      (await event.locals.pb.collection("users").authRefresh());
  } catch (_) {
    // clear the auth store on failed refresh
    event.locals.pb.authStore.clear();
  }
  // console.log("done");
  const response = await resolve(event);

  // send back the default 'pb_auth' cookie to the client with the latest store state
  response.headers.append(
    "set-cookie",
    event.locals.pb.authStore.exportToCookie()
  );

  // const email = 'branila.claudiustefan.studente@itispaleocapa.it'

  // const [error, user] = await goCatch(
  //   pb.collection('users').getFirstListItem(`email="${email}"`),
  // )

  // if (error) {
  //   console.error(error)
  // }

  // const authData = await pb.collection("users").authWithOAuth2({
  //   provider: "oidc",
  // });

  // pb.authStore.save(authData.token, {
  //   ...authData.record,
  //   collectionId: "users",
  //   collectionName: "users",
  // });

  // event.locals.user = event.locals.pb.authStore.record;

  return await resolve(event);
};

export default authentication;
