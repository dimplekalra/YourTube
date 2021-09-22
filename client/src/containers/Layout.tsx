import React, { useState } from "react";
import Navbar from "./Nav";
import Content from "./Content";
import Search from "../controls/Search";
import searchContext from "../context/state-context";
import { filterMediaList } from "../common/utility";
import { filterUserList } from "../common/utility";
import { IAcceptAll, IApiCallStatus } from "../common/interfaces";
import { API } from "../common/interfaces";

const Layout = (props: IAcceptAll) => {
  const [search, setSearch] = useState<string>("");
  const [currentAPI, setCurrentAPI] = useState<string>("");
  const [activePage, setActivePage] = useState<number>(1);
  const [AllRecords, setAllRecords] = useState<any[]>([]);
  const [FilteredArray, setFilteredArray] = useState<any[]>([]);
  const [APIStatus, setAPIStatus] = useState<IApiCallStatus>({
    InProgress: false,
    Failed: false,
    FailMessage: "",
  });

  const [fetching, setFetching] = useState<boolean>(false);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setSearch(value);
    let records: any[] = FilteredArray;
    if (value.trim().length) {
      records = records.filter((o) =>
        Object.keys(o).some((k) =>
          o[k].toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredArray(records);
    } else {
      setFilteredArray(AllRecords);
      return;
    }
  };

  const init = (api: API) => {
    setAllRecords([]);
    setFilteredArray([]);
    setSearch("");
    setCurrentAPI(api);
    setActivePage(1);
    setAPIStatus({
      InProgress: false,
      Failed: false,
      FailMessage: "",
    });
  };

  const setAPIState = (obj: IApiCallStatus) => {
    setAPIStatus(obj);
  };

  const handleChange = (name: string, value: string) => {
    setSearch(value);
    if (value && value.length) {
      switch (currentAPI) {
        case "media":
          setFilteredArray(filterMediaList(value, FilteredArray));
          break;
        case "user":
          setFilteredArray(filterUserList(value, FilteredArray));
          break;
        default:
          return;
      }
    } else setFilteredArray(AllRecords);
  };

  const loadData = async (api: Function) => {
    try {
      setFetching(true);
      setAPIStatus({
        ...APIStatus,
        InProgress: true,
      });

      let result = await api();

      if (result != null) {
        setFilteredArray((prevState) => {
          return prevState.concat(result);
        });
        setAllRecords((prevState) => {
          return prevState.concat(result);
        });
        setAPIStatus({
          ...APIStatus,
          InProgress: false,
        });
      } else {
        throw new Error("could not load data");
      }
    } catch (err: any) {
      setAPIStatus({
        InProgress: false,
        Failed: true,
        FailMessage: err.message,
      });
    } finally {
      setFetching(false);
    }
  };

  const HandlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);

    if (search !== "") {
      return;
    }
  };

  return (
    <>
      <searchContext.Provider
        value={{
          search,
          activePage,
          fetching,
          AllRecords,
          FilteredArray,
          APIStatus,
          currentAPI,
          handleChange,
          loadData,
          HandlePageChange,
          init,
          setAPIState,
          onSearch,
        }}
      >
        <div className="row">
          <div className="col s2">
            <div className="">
              <Navbar />
            </div>
          </div>

          <div className="col s10 main-area">
            <div className="col s10">
              <Search
                search={search}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e.target.name, e.target.value)
                }
              />
            </div>
            <div className="col s12 ">
              <Content />
            </div>
          </div>
        </div>
      </searchContext.Provider>
    </>
  );
};

export default Layout;
