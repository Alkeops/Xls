import xlsx from "xlsx";

const decodeXls = ({ data }) => {
  const workbook = xlsx.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
  const json = xlsx.utils.sheet_to_json(worksheet);
  let columns = headers;
  let values = {};
  let search = json.slice(0, 20);
  let negativeSpace = [];
  for (let key of headers) {
    search.forEach((item) => {
      if (item?.[key]?.split(" ")?.length > 10) {
        negativeSpace = [...new Set([...negativeSpace, key])];
      }
    });
  }
  headers = headers.filter((item) => !negativeSpace.includes(item));
  let collection = {};
  for (let key of headers) {
    values[key] = [...new Set(json.map((item) => item[key]).filter(Boolean))];
  }
  for (let value of Object.values(values).flat()) {
    collection[value] = json
      .filter((item) => Object.values(item).includes(value))
      .map((item) => item["SKU"]);
  }

  return {
    columns,
    json,
    uniques: values,
    searching: collection,
  };
};

addEventListener("message", (e) => {
  postMessage(decodeXls(e.data));
});
