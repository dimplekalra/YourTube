import { signout } from "./api/auth";

import { IUser, IJWT, IMedia } from "./interfaces";

export const auth = {
  isAuthenticated() {
    if (typeof window === "undefined") return false;

    const item = sessionStorage.getItem("jwt");

    if (item) return JSON.parse(item);
    else return false;
  },
  authenticate(jwt: IJWT, cb: () => void) {
    if (typeof window !== "undefined")
      sessionStorage.setItem("jwt", JSON.stringify(jwt));
    cb();
  },
  signOut(cb: () => void) {
    if (typeof window !== "undefined") sessionStorage.removeItem("jwt");
    cb();

    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  },
};

export const filterMediaList = (value: string, list: IMedia[]) => {
  return value && value.trim().length
    ? list.filter((o) =>
        Object.keys(o).some((k) => {
          return k === "title" || k === "description" || k === "genre"
            ? o[k].toLowerCase().includes(value.toLowerCase())
            : false;
        })
      )
    : list;

  // const array = list.filter((obj) => {
  //   return Object.entries(obj).some((val) => {
  //     if (
  //       val[0] === "title" ||
  //       val[0] === "description" ||
  //       val[0] === "genre"
  //     ) {
  //       return val[1].toLowerCase().includes(value.toLowerCase()) !== -1;
  //     } else return false;
  //   });
  // });

  // return array;
};

export const filterUserList = (value: string, list: IUser[]) => {
  return value && value.trim().length
    ? list.filter((o) =>
        Object.keys(o).some((k) => {
          return k === "name" || k === "email"
            ? o[k].toLowerCase().includes(value.toLowerCase())
            : false;
        })
      )
    : list;

  // const array = list.filter((obj) => {
  //   return Object.entries(obj).some((val) => {
  //     if (val[0] === "name" || val[0] === "email")
  //       return val.includes(value) !== -1;
  //     else return false;
  //   });
  // });
  // return array;
};

export const ItemsPerPage = (list: any[], page: number) => {
  const array = list.filter((val, idx) => {
    let low, high;
    low = page * 9 - 9;
    high = page * 9;

    if (idx >= low && idx < high) return true;
    else return false;
  });

  return array;
};
