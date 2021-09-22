import { BaseURL } from "../endpoints";

export const signIn = (user:object) => {
  return fetch(`${BaseURL}/auth/signin/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // credentials: "include",
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const signout = async () => {
  return await fetch("/auth/signout/", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
