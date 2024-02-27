export async function load({ params }) {
  //TODO: load userdata from bpy api
  const requestedUserId = params.userId;
  return {
    userdata: {
      id: requestedUserId,
      username: "test1234",
    },
  };
}
