import { BaseURL } from "../endpoints";

import { ICredentials } from "../interfaces";

export interface IParams {
  userId?: string | number;
  mediaId?: string | number;
}

interface TBody {
  title: string;
  description: string;
  video: Blob | string | null;
  genre: string;
}

export const create = <TBody extends BodyInit>(
  params: IParams,
  credential: ICredentials,
  media: TBody
) => {
  return fetch(`${BaseURL}/media/new/${params.userId}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${credential.t}`,
    },
    body: media,
  })
    .then((res) => res.json())
    .catch((err) => console.log(err.message));
};

export const listPopular = () => {
  return fetch(`${BaseURL}/media/popular`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const listByUser = (params: IParams, credentials: ICredentials) => {
  return fetch(`${BaseURL}/media/by/${params.userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const read = (params: IParams) => {
  return fetch(`${BaseURL}/media/${params.mediaId}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const update = (
  params: IParams,
  credentials: ICredentials,
  media: object
) => {
  return fetch(BaseURL + "/media/" + params.mediaId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t,
    },
    body: JSON.stringify(media),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const remove = (params: IParams, credentials: ICredentials) => {
  const { mediaId } = params;
  return fetch(`${BaseURL}/media/${mediaId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err.message));
};

export const listRelated = (params: IParams) => {
  return fetch(`${BaseURL}/media/related/${params.mediaId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err.message));
};

export const listAllMedia = (credentials: ICredentials) => {
  return fetch(`${BaseURL}/media/list`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + credentials.t,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err.message));
};
