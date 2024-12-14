import {type Handle} from "@sveltejs/kit";

// TODO: Implement a real authentication system
const authentication: Handle = async ({event, resolve}) => {
  const pb = event.locals.pb;

  // const email = 'branila.claudiustefan.studente@itispaleocapa.it'

  // const [error, user] = await goCatch(
  //   pb.collection('users').getFirstListItem(`email="${email}"`),
  // )

  // if (error) {
  //   console.error(error)
  // }

  const authData = await pb.collection("users").authWithOAuth2({
    provider: "oidc",
  });

  pb.authStore.save(authData.token, {
    ...authData.record,
    collectionId: "users",
    collectionName: "users",
  });

  event.locals.user = authData.record;

  return await resolve(event);
};

export default authentication;
