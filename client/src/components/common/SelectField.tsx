import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface SelectFieldProps {
  initValue?: string;
  records?: any[];
  errors?: string;
  options?: any[];
  register?: any;
  componentId: string;
  name?: string;
  label: string;
  showNA?: boolean;
  isDealTypeSelect?: boolean;
  setDealTypeValue?: React.Dispatch<React.SetStateAction<any>>;
  isDealType2Select?: boolean;
  isDealtype2Update?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  initValue,
  records,
  errors,
  options,
  register,
  componentId,
  name,
  label,
  showNA = false,
  isDealTypeSelect,
  setDealTypeValue,
  isDealType2Select,
  isDealtype2Update,
  ...restProps
}) => {
  const [value, setValue] = useState<string>(initValue || "N/A");
  
  useEffect(() => {
    if (initValue && initValue !== "N/A") {
      setValue(initValue);
    }
    if (isDealTypeSelect && setDealTypeValue) {
      if (records?.find(item => item['id'] === value)?.name === 'SubsequentClose') {
        setDealTypeValue((pre: any) => ({ ...pre, show: true }))
      } else {
        setDealTypeValue((pre: any) => ({ ...pre, show: false }));
      }
    }
    if (isDealType2Select && setDealTypeValue && !isDealtype2Update) {
      setDealTypeValue((pre: any) => ({ ...pre, value }))
    }
  }, [value, initValue, isDealTypeSelect, isDealType2Select, isDealtype2Update, records, setDealTypeValue]);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };
  
  return (
    <div style={{ width: "100%", paddingTop: "10px" }} className="custom-select">
      <FormControl style={{ width: '100%' }}>
        <InputLabel id="demo-select-small-label">{label}</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id={componentId}
          value={value}
          label={label}
          {...(register ? register(componentId) : {})}
          onChange={handleChange}
          MenuProps={MenuProps}>
          {showNA && (<MenuItem value={"N/A"} divider={true}>N/A</MenuItem>)}
          {(records || []).map((item, index) => {
            let isDivider = records && records[index]?.name?.split(" ")[0] === records[index + 1]?.name?.split(" ")[0] || index === (records || []).length - 1;
            return (<MenuItem key={item?.id || index} value={item?.id || item} divider={!isDivider}>{item?.name || item}</MenuItem>)
          })}
        </Select>
      </FormControl>
      {errors && <p style={{ color: "red" }}>{errors}</p>}
    </div>
  );
};
export default SelectField; 