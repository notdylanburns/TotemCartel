import fs from "node:fs";

export const write_db = (db, path) => fs.writeFile(path, JSON.stringify(db), () => {});