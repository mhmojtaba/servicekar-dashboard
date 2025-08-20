export const selectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "var(--neutral-200)",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--primary-400)",
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "var(--primary-50)" : "white",
    color: state.isFocused ? "var(--primary-800)" : "var(--neutral-800)",
  }),
};

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "48px",
    border: state.isFocused ? "2px solid #99CAFF" : "2px solid #E2E8F0",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(61, 139, 255, 0.1)" : "none",
    "&:hover": {
      border: state.isFocused ? "2px solid #99CAFF" : "2px solid #CBD5E1",
    },
    transition: "all 0.2s ease",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 12px",
    direction: "rtl",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#94A3B8",
    fontSize: "0.9rem",
    textAlign: "right",
    direction: "rtl",
  }),
  input: (provided) => ({
    ...provided,
    direction: "rtl",
    textAlign: "right",
  }),
  singleValue: (provided) => ({
    ...provided,
    direction: "rtl",
    textAlign: "right",
    color: "#1E293B",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#E0EFFF",
    borderRadius: "0.375rem",
    direction: "rtl",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#2970CC",
    fontSize: "0.875rem",
    fontWeight: "500",
    direction: "rtl",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#2970CC",
    "&:hover": {
      backgroundColor: "#C2DFFF",
      color: "#1E5599",
    },
    borderRadius: "0 0.375rem 0.375rem 0",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#3D8BFF" : "#64748B",
    "&:hover": {
      color: "#3D8BFF",
    },
    transition: "color 0.2s ease",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#64748B",
    "&:hover": {
      color: "#EF4444",
    },
    transition: "color 0.2s ease",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #E2E8F0",

    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    zIndex: 9999,
    marginTop: "4px",
    direction: "rtl",

    maxHeight: "240px",
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 99999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: "8px",

    maxHeight: "180px",
    overflowY: "scroll",
    direction: "rtl",
    scrollbarWidth: "thin",
    scrollbarColor: "#CBD5E1 #F1F5F9",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#F1F5F9",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#CBD5E1",
      borderRadius: "4px",
      border: "1px solid #F1F5F9",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#94A3B8",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#3D8BFF"
      : state.isFocused
        ? "#F0F7FF"
        : "transparent",
    color: state.isSelected ? "#FFFFFF" : "#1E293B",
    padding: "12px 16px",
    margin: "2px 0",
    borderRadius: "0.375rem",
    fontSize: "0.9rem",
    fontWeight: state.isSelected ? "500" : "400",
    cursor: "pointer",
    transition: "all 0.15s ease",
    direction: "rtl",
    textAlign: "right",
    "&:hover": {
      backgroundColor: state.isSelected ? "#2970CC" : "#99caff",
    },
    "&:active": {
      backgroundColor: state.isSelected ? "#1E5599" : "#E0EFFF",
    },
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: "#64748B",
    fontSize: "0.9rem",
    padding: "12px 16px",
    textAlign: "center",
    direction: "rtl",
  }),
  loadingMessage: (provided) => ({
    ...provided,
    color: "#64748B",
    fontSize: "0.9rem",
    padding: "12px 16px",
    textAlign: "center",
    direction: "rtl",
  }),
};
