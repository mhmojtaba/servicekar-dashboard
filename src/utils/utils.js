import { addFile } from "@/services/requestsServices";

export const convertToEnglishDigits = (str) => {
  if (!str) return str;

  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

  let result = str.toString();

  for (let i = 0; i < 10; i++) {
    const persianRegex = new RegExp(persianDigits[i], "g");
    const arabicRegex = new RegExp(arabicDigits[i], "g");
    result = result.replace(persianRegex, i).replace(arabicRegex, i);
  }

  return result;
};

export function uploadFile(file, token) {
  if (!file) {
    console.error("No file selected");
    return;
  }
  const data = {
    token: token,
    file: file,
  };

  return addFile(data);
}

// This function disable the default behavior of arrow keys in an input field
export const preventArrowKeyChange = (e) => {
  // Check if the pressed key is an arrow key
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
};

export const selectOptionsGenerator = (options) => {
  return options.map((option) => ({
    value: option.id,
    label: option.title,
  }));
};

export const selectOptionsGeneratorWithName = (item) => {
  return item.map((option) => ({
    value: option.id,
    label: option.first_name + " " + option.last_name,
  }));
};
