import React from "react";
import { API, IApiCallStatus } from "../common/interfaces";

export type ContextProps = {
  search: string;
  activePage: number;
  fetching: boolean;
  AllRecords: any[];
  FilteredArray: any[];
  APIStatus: {
    InProgress: boolean;
    Failed: boolean;
    FailMessage: string;
  };
  currentAPI: string;
  handleChange: (name: string, value: string) => void;
  loadData: (api: Function) => void;
  HandlePageChange: (pageNumber: number) => void;
  init: (api: API) => void;
  setAPIState: (obj: IApiCallStatus) => void;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default React.createContext<Partial<ContextProps>>({
  search: "",
  activePage: 1,
  fetching: false,
  AllRecords: [],
  FilteredArray: [],
  APIStatus: {
    InProgress: false,
    Failed: false,
    FailMessage: "",
  },
  currentAPI: "",
  handleChange: (name, value) => {},
  loadData: (api) => {},
  HandlePageChange: () => {},
  init: (api) => {},
  setAPIState: () => {},
  onSearch: () => {},
});
