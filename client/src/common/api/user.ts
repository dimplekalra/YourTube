import { BaseURL } from "../endpoints";

import {ICredentials } from "../interfaces";

export interface IParams{
    userId: string | number   
}


export const create = (user:object) => {
  return fetch(BaseURL + "/users/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const list = () => {
  return fetch(`${BaseURL}/users/`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};
export const read = (params:IParams, credentials:ICredentials ) => {
  return fetch(`${BaseURL}/users/${params.userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const update = (params:IParams, credentials:ICredentials, user:object) => {
  return fetch(`${BaseURL}/users/${params.userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${credentials.t}`,
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const remove = (params:IParams, credentials:ICredentials) => {
  return fetch(`${BaseURL}/users/${params.userId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
