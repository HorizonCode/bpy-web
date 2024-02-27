export function load({ url }) {
  return {
    url: url.pathname,
    currentUser: {
      id: 1001,
      username: "Quetzalcoatl",
    },
  };
}
