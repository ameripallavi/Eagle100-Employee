import pool from "../../db/config.js";

export const addFilter = (filter, query, not = false) => {
  let filterValues = [];
  let queryString;
  let filterString = "";
  try {
    if (typeof query === "object") {
      queryString = query.query;
      filterValues = query.values;
    } else queryString = query;

    if (Object.entries(filter).length !== 0 && filter.constructor === Object) {
      let keys = Object.keys(filter);
      keys.forEach((key, i) => {
        let values = String(filter[key]);
        let valuesLength = filterValues.length;
        if (values) {
          if (i > 0 || queryString.includes("WHERE")) filterString += ` AND `;
          else filterString += ` WHERE `;

          const array = /\[(.*)\]/;
          if (array.test(values)) {
            values = values.match(array)[1];
            if (/^\d+$/.test(values)) values = parseInt(values);
            filterString += `$${valuesLength + 1} = ANY(${key})`;
            filterValues.push(values);
          } else if (values.includes(",")) {
            filterString += `${key} ${not ? "NOT" : ""} IN (`;
            values.split(",").forEach((value, i) => {
              filterString += `${i > 0 ? `,` : ``}$${valuesLength + 1}`;
              filterValues.push(value);
              valuesLength = filterValues.length;
            });
            filterString += `)`;
          } else {
            filterString += `${key} ${not ? "NOT" : ""} IN ($${
              valuesLength + 1
            })`;
            filterValues.push(values);
          }
        }
      });
    }
  } catch (error) {
    console.log("Add filter error:", error);
  }

  if (queryString.includes("ORDER BY")) {
    const queryArray = queryString.split("ORDER BY");
    queryArray.splice(1, 0, filterString);
    queryArray.splice(2, 0, " ORDER BY");
    return { query: queryArray.join(""), values: filterValues };
  }
  return { query: `${queryString} ${filterString}`, values: filterValues };
};

export const genUpdateQ = (table, data) => {
  let query = `UPDATE ${table} SET`;
  let values = [];
  Object.keys(data).forEach((key, i) => {
    query += `${i > 0 ? `, ` : ``} ${key} = $${i + 1}`;
    values.push(data[key]);
  });
  return { query: query, values: values };
};

export const genInsertQ = (table, columns, data) => {
  let values = [];
  let query = `INSERT INTO ${table}(${columns.join(',')}) VALUES(${columns.map((col, i) => `$${i + 1}`).join(',')})`;
  columns.forEach(col => values.push(data[col]));
  return { query: query, values: values };
};

export const db = (querys) => {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.query("BEGIN");
      if (!Array.isArray(querys)) querys = [querys];
      let res;
      for (let query of querys) {
        console.log("Query:", query.query, query.values);
        res = await pool.query(query.query, query.values);
      }
      await pool.query("COMMIT");
      resolve(res);
    } catch (err) {
      await pool.query("ROLLBACK");
      console.log(err);
      reject(err);
    }
  });
};

export const cleanInput = (data) => {
  Object.keys(data).forEach((key) => {
    data[key] = subClean(data[key]);
  });
  return data;
};

export const subClean = (input) => {
  if (["boolean", "object"].includes(typeof input)) return input;
  else if (!input) return null;
  else if (isNaN(input)) return `${input.replace(/'/g, "")}`;
  else return `${input}`;
};