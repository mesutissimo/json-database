const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const dbPath = "data";

const readDb = (table) => {
  const tablePath = path.join(dbPath, table);
  const tableDataPath = path.join(tablePath, "data.json");
  let tableData = {};
  try {
    const dbFileData = fs.readFileSync(tableDataPath);
    tableData = JSON.parse(dbFileData);
  } catch (e) {
    if (e.code === "ENOENT") {
      fs.mkdirSync(tablePath);
      fs.writeFileSync(tableDataPath, JSON.stringify({}));
      readDb(table);
    }
  }
  return tableData;
};

const writeDb = (tableData, table = "default") => {
  const tablePath = path.join(dbPath, table);
  const tableDataPath = path.join(tablePath, "data.json");
  try {
    fs.writeFileSync(tableDataPath, JSON.stringify(tableData, null, 2));
  } catch (e) {
    console.log("hata", e);
    return false;
  }
  return true;
};

const insert = (data, table, options = { upsert: true }) => {
  if (!data) return false;
  const tableData = readDb(table);

  if (data.length) {
    data.forEach((d) => {
      const _id = d._id || v4();
      const dbData = { _id, ...d };
      Object.assign(tableData, { [_id]: dbData });
    });
  } else {
    const _id = data._id || v4();
    const dbData = { _id, ...data };
    Object.assign(tableData, { [_id]: dbData });
  }
  const success = writeDb(tableData, table);
  return success;
};

const select = (table) => {
  const tableData = readDb(table);
  return tableData
};

module.exports = { select, insert };
