import { redirect } from '@sveltejs/kit';


export const load = ({ cookies }) => {
  if (cookies.get("sessionToken") === undefined) {
    redirect(302, "/");
  }
}