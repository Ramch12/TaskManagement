import React, { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDebounce } from 'use-debounce';
import axios from "axios";

import { fetchSimiliarCompanies } from "../../API/fund";
import { useAuth } from "../../Hooks/useAuth";
import { notification } from "../../service/index";

const SelectComponent = ({ selectCompany, initValue }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [records, setRecords] = useState([]);
  const [value, setValue] = React.useState(initValue || null);
  const { token } = useAuth();

  useEffect(() => {
    const source = axios.CancelToken.source()
    if (debouncedSearch) {
      fetchSimiliarCompanies(token, debouncedSearch, source)
        .then((res) => {
          if (res?.status === 200 && res?.data?.status) {
            setRecords(res?.data?.companies);
          }
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            return;
          }
          setRecords([]);
          notification({ title: "Error", type: "danger", message: err.message });
        });
    } else {
      setRecords([]);
    }
    return () => {
      source.cancel('request canceled!')
    }
  }, [debouncedSearch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    selectCompany(records.find((item) => item.CompanyName === newValue)?.id);
  };

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={handleChange}
        inputValue={search}
        onInputChange={(event, newInputValue) => {
          setSearch(newInputValue);
          if (value) {
            setValue(null);
          }
          if (event) {
            selectCompany(null);
          }
        }}
        freeSolo
        id="free-solo-demo"
        options={records.map((item) => item.CompanyName)}
        sx={{ width: "100%", marginTop: "10px" }}
        size="small"
        renderInput={(params) => <TextField {...params} label="Company" />}
      />
    </div>
  );
};

export default SelectComponent;
