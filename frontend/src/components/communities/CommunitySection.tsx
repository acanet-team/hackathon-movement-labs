import { combineUniqueById } from "@/utils/combine-arrs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DotWaveLoader from "../DotWaveLoader";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import styles from "@/styles/modules/communities.module.scss";
import CommunityForm from "@/components/communities/CommunityForm";
import type { ICommunity } from "@/api/community/model";
import { getCommunities } from "@/api/community";
import { useSession } from "next-auth/react";
import CommunityCard from "./CommunityCard";
import { useTranslations } from "next-intl";

export default function CommunitySection(props: {
  isBroker: boolean;
  communities: ICommunity[];
  communityType: string;
  curPage: number;
  allPage: number;
  take: number;
}) {
  const tForm = useTranslations("Form");
  const [communityArr, setCommunityArr] = useState<ICommunity[]>(
    props.communities,
  );
  const [take, setTake] = useState<number>(props.take);
  const [page, setPage] = useState<number>(props.curPage);
  const [totalPage, setTotalPage] = useState<number>(props.allPage);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  // const [filterValue, setFilterValue] = React.useState<string[]>([]);
  const [filterValues, setFilterValues] = useState<{
    searchValue: string;
    filterValue: string;
  }>({ searchValue: "", filterValue: "" });
  const [shownFilterValue, setShownFilterValue] = React.useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<string>("");
  const [brokerId, setBrokerId] = useState<number | "">("");
  const filters = [
    tForm("filter_none"),
    tForm("filter_free"),
    tForm("filter_paid"),
  ];
  const [hasFetchedInitialData, setHasFetchedInitialData] =
    useState<boolean>(false);
  const [readyToFetch, setReadyToFetch] = useState<boolean>(false);
  const { data: session } = useSession();
  const [switchTab, setSwitchTab] = useState<boolean>(false);

  useEffect(() => {
    if (session && session.user?.isBroker) {
      setBrokerId(session.user.id);
    }
  }, [session]);

  const fetchCommunities = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getCommunities({
        page,
        take,
        type:
          props.communityType === "popular"
            ? "not_joined"
            : props.communityType === "following"
              ? "joined"
              : "",
        brokerId: props.communityType === "owned" ? brokerId : "",
        search: filterValues.searchValue,
        feeType: filterValues.filterValue
          ? filterValues.filterValue.toLowerCase()
          : "",
      });
      // console.log("Communities fetched:", response);
      setCommunityArr((prev) => {
        const newCommunities = combineUniqueById(
          prev,
          response.data.docs as ICommunity[],
        );
        return newCommunities as ICommunity[];
      });
      setTotalPage(response.data?.meta?.totalPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite scroll
  const onScrollHandler = () => {
    if (document.documentElement) {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight &&
        !isLoading &&
        page < totalPage
      ) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (document.documentElement && page < totalPage) {
      window.addEventListener("scroll", onScrollHandler);
    }
    return () => {
      if (document.documentElement) {
        window.removeEventListener("scroll", onScrollHandler);
      }
    };
  }, [page, totalPage, isLoading]);

  useEffect(() => {
    if (hasFetchedInitialData) {
      setSwitchTab(true);
      setFilterValues({ searchValue: "", filterValue: "" });
      if (searchRef.current) {
        searchRef.current.value = "";
      }
      setShownFilterValue(tForm("filter_none"));
      setPage(1);
      setTotalPage(2);
      setCommunityArr([]);
      setReadyToFetch(true);
    }
  }, [props.communityType]);

  useEffect(() => {
    if (readyToFetch) {
      fetchCommunities(1);
      setReadyToFetch(false);
      setSwitchTab(false);
    }
  }, [readyToFetch]);

  const prevFilterValues = useRef(filterValues);
  useEffect(() => {
    // Check if filterValues have changed compared to the previous state
    const hasSearchChanged =
      prevFilterValues.current.searchValue !== filterValues.searchValue;
    const hasFilterChanged =
      prevFilterValues.current.filterValue !== filterValues.filterValue;

    // Call fetchCommunities only if either of the values changed on the SAME tab
    if ((hasSearchChanged || hasFilterChanged) && !switchTab) {
      setPage(1);
      setCommunityArr([]);
      fetchCommunities(1);
    } else if (
      // Call fetchCommunities if deleting filters on the SAME tab
      (filterValues.searchValue === "" || filterValues.filterValue === "") &&
      !switchTab &&
      hasFetchedInitialData
    ) {
      fetchCommunities(1);
    }
    // Update the previous filter values after each effect run
    prevFilterValues.current = filterValues;
  }, [filterValues]);

  useEffect(() => {
    if (page > 1) {
      fetchCommunities(page);
    }
  }, [page]);

  // Avoid fetching data on initial render
  useEffect(() => {
    if (!hasFetchedInitialData) {
      setHasFetchedInitialData(true);
    }
  }, []);

  const onFilterHandler = (e: SelectChangeEvent) => {
    const localeFilterValue = e.target.value;
    const filterValue =
      localeFilterValue === tForm("filter_free")
        ? "free"
        : localeFilterValue === tForm("filter_paid")
          ? "paid"
          : "";
    setFilterValues((prev) => ({ ...prev, filterValue: filterValue }));
    setShownFilterValue(localeFilterValue);
  };
  // const onFilterHandler = (e: SelectChangeEvent) => {
  //   setFilterValue((prev: string[]) => {
  //     const filterValue = e.target.value;
  //     if (prev.includes(filterValue)) {
  //       // If the value is already selected, remove it
  //       // return prev.filter(value => value !== filterValue);
  //       return [];
  //     } else {
  //       // If the value is not selected, add it
  //       return [filterValue];
  //     }
  //   });
  // };

  const onSearchHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputElement = searchRef.current;
      if (inputElement) {
        setFilterValues((prev) => ({
          ...prev,
          searchValue: inputElement.value,
        }));
        // setSearchValue(searchRef.current.value);
      }
    }
  };

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const handleShow = useCallback(() => {
    setShow(true);
  }, []);

  const onCreateGroupHandler = () => {
    handleShow();
    setIsEditing("");
  };

  const onEditGroupHandler = (groupId: string) => {
    handleShow();
    setIsEditing(groupId);
  };

  return (
    <>
      {/* Search */}
      <div className={`${styles["search-section"]} my-3 d-flex gap-2`}>
        <Box
          component="form"
          sx={{ width: "65%" }}
          noValidate
          autoComplete="off"
          className={styles["search-box"]}
        >
          <TextField
            id="outlined-basic"
            label={tForm("search")}
            variant="outlined"
            className="w-100"
            inputRef={searchRef}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              onSearchHandler(e)
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.MuiInputBase-root fieldset": {
                  borderColor: "#ddd",
                },
              },
              ".MuiFormLabel-root": { fontSize: "15px" },
            }}
          />
        </Box>
        {/* Filter */}
        <FormControl
          sx={
            props.communityType === "owned"
              ? { width: "15%" }
              : { width: "35%" }
          }
          className={styles["filter-box"]}
        >
          <InputLabel id="filter">
            <i className="bi bi-filter me-1"></i>
            {tForm("filter")}
          </InputLabel>
          <Select
            labelId="filter"
            id="filter"
            value={shownFilterValue}
            // value={filterValue}
            // value={filterValue[0] || ""}
            onChange={onFilterHandler}
            input={<OutlinedInput label="Filter&nbsp" />}
            // renderValue={(selected) => selected}
            renderValue={(selected) => {
              if (!selected) {
                return "";
              }
              return selected;
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ddd",
              },
            }}
          >
            {filters.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={shownFilterValue.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {props.isBroker && props.communityType === "owned" && (
          <button
            className={`${styles["new-community__btn"]} btn btn-primary text-white`}
            onClick={onCreateGroupHandler}
          >
            + {tForm("add_new")}
          </button>
        )}
      </div>
      {/* Communities */}
      <div className="middle-sidebar-left pe-0">
        <div className="row">
          <div className="col-xl-12">
            <div className="row ps-2 pe-1">
              {!isLoading && communityArr.length === 0 && (
                <div className="text-center mt-5">No community found.</div>
              )}
              {communityArr.length > 0 &&
                communityArr.map((group, index) => (
                  <div key={index} className="col-md-6 col-sm-6 pe-2 ps-2 mb-3">
                    <CommunityCard
                      groupId={group.id}
                      name={group.name}
                      ownerId={group.owner?.userId}
                      coverImg={group.coverImage?.path}
                      avatar={group.avatar?.path}
                      firstName={group.owner?.firstName}
                      lastName={group.owner?.lastName}
                      nickName={group.owner?.nickName}
                      membersCount={group.membersCount}
                      communityStatus={group.communityStatus}
                      fee={group.fee}
                      description={group.description}
                      isBroker={props.isBroker}
                      communityType={props.communityType}
                      onEditGroupHandler={onEditGroupHandler}
                    />
                  </div>
                ))}
            </div>
          </div>
          {isLoading && <DotWaveLoader />}
          {show && (
            <CommunityForm
              isEditing={isEditing}
              handleClose={handleClose}
              handleShow={handleShow}
              show={show}
              setCommunities={setCommunityArr}
            />
          )}
        </div>
      </div>
    </>
  );
}
