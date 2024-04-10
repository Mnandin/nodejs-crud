import express from "express";
import dayjs from "dayjs";
import { z } from "zod";
import db from "../utils/mysql2-connect.js";

const router = express.Router();

// 這個 router 的 top level middleware
router.use((req, res, next) => {
  const whiteList = ["/", "/api"];
  let path = req.url.split("?")[0]; // 取 ? 前面 (左側) 的路徑資料
  if (!whiteList.includes(path)) {
    // 如果路徑不在白名單裡
    if (!req.session.admin) {
      // 沒有登入
      // return res.send("<h2>請先登入管理者帳號</h2>");
      return res.redirect(`/login?u=${req.originalUrl}`);
    }
  }

  next();
});

const getListData = async (req) => {
  let page = +req.query.page || 1;

  let keyword = req.query.keyword || "";

  let where = " WHERE 1 ";
  if (keyword) {
    // where += ` AND \`name\` LIKE '%${keyword}%'  `; // 錯誤的寫法會有 SQL injection 的問題
    const keywordEsc = db.escape("%" + keyword + "%");
    where += ` AND ( 
      \`name\` LIKE ${keywordEsc} 
      OR 
      \`mobile\` LIKE ${keywordEsc} 
      ) `;
  }
  const dateFormat = "YYYY-MM-DD";
  // 篩選: 起始生日的日期
  let date_begin = req.query.date_begin || "";
  if (dayjs(date_begin, dateFormat, true).isValid()) {
    date_begin = dayjs(date_begin).format(dateFormat);
  } else {
    date_begin = "";
  }
  if (date_begin) {
    where += ` AND birthday >= '${date_begin}' `;
  }

  // 篩選: 結束生日的日期
  let date_end = req.query.date_end || "";
  if (dayjs(date_end, dateFormat, true).isValid()) {
    date_end = dayjs(date_end).format(dateFormat);
  } else {
    date_end = "";
  }
  if (date_end) {
    where += ` AND birthday <= '${date_end}' `;
  }

  if (page < 1) {
    return { success: false, redirect: "?page=1" };
  }
  const perPage = 25;
  const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
  const [[{ totalRows }]] = await db.query(t_sql);

  let rows = []; // 預設值
  let totalPages = 0;
  if (totalRows) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      // bugfix: 包含其他的參數
      const newQuery = { ...req.query, page: totalPages };
      const qs = new URLSearchParams(newQuery).toString();
      return { success: false, redirect: `?` + qs };
    }
    const sql = `SELECT * FROM address_book
    ${where}
    ORDER BY sid DESC 
    LIMIT ${(page - 1) * perPage}, ${perPage}`;
    [rows] = await db.query(sql);

    rows.forEach((r) => {
      if (r.birthday) {
        r.birthday = dayjs(r.birthday).format("YYYY-MM-DD");
      }
    });
  }
  return {
    success: true,
    totalRows,
    totalPages,
    page,
    perPage,
    rows,
    query: req.query,
  };
};

router.get("/", async (req, res) => {
  res.locals.title = "通訊錄列表 - " + res.locals.title;
  res.locals.pageName = "ab-list";
  const data = await getListData(req);
  if (data.redirect) {
    return res.redirect(data.redirect);
  }
  if(req.session.admin){
    res.render("address-book/list", data);
  } else {
    res.render("address-book/list-no-admin", data);
  }

});

router.get("/api", async (req, res) => {
  const data = await getListData(req);
  res.json(data);
});

router.get("/add", async (req, res) => {
  res.locals.title = "新增通訊錄 - " + res.locals.title;
  res.locals.pageName = "ab-add";
  res.render("address-book/add");
});
router.post("/add", async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    errors: {},
  };

  let isPass = true;

  // TODO: 欄位資料檢查
  const schemaName = z.string().min(2, { message: "姓名需填兩個字以上" });
  const schemaEmail = z.string().email({ message: "請填寫正確的電郵123" });

  const r1 = schemaName.safeParse(req.body.name);
  if (!r1.success) {
    isPass = false;
    output.errors.name = r1.error.issues[0].message;
  }
  const r2 = schemaEmail.safeParse(req.body.email);
  if (!r2.success) {
    isPass = false;
    output.errors.email = r2.error.issues[0].message;
  }
  // 處理生日
  let birthday = req.body.birthday;
  if (dayjs(birthday, "YYYY-MM-DD", true).isValid()) {
    birthday = dayjs(birthday).format("YYYY-MM-DD");
  } else {
    birthday = null;
  }
  req.body.birthday = birthday;

  let result = {};
  if (isPass) {
    req.body.created_at = new Date();
    const sql = "INSERT INTO `address_book` SET ? ";

    try {
      [result] = await db.query(sql, [req.body]);
      output.success = !!result.affectedRows;
    } catch (ex) {}
  }

  res.json(output);
  /*
  {
    "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 1001,
    "info": "",
    "serverStatus": 2,
    "warningStatus": 0,
    "changedRows": 0
  }
  */
});

// 刪除單筆資料
router.delete("/:sid", async (req, res) => {
  let sid = +req.params.sid || 0;
  const output = {
    success: false,
    sid,
  };

  if (sid >= 1) {
    const sql = `DELETE FROM address_book WHERE sid=${sid}`;
    const [result] = await db.query(sql);
    output.success = !!result.affectedRows;
  }

  res.json(output);
});

router.get("/edit/:sid", async (req, res) => {
  let sid = +req.params.sid || 0;
  const sql = `SELECT * FROM address_book WHERE sid=? `;
  const [rows] = await db.query(sql, [sid]);
  if (!rows.length) {
    // 沒有該筆資料時, 直接跳轉
    return res.redirect("/address-book");
  }
  res.locals.title = "編輯通訊錄 - " + res.locals.title;
  res.locals.pageName = "ab-edit";

  if (rows[0].birthday) {
    rows[0].birthday = dayjs(rows[0].birthday).format("YYYY-MM-DD");
  }

  res.render("address-book/edit", rows[0]);
});

router.put("/edit/:sid", async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    error: "",
  };
  let sid = +req.params.sid || 0;

  // TODO: 表單資料欄位檢查

  const sql = "UPDATE `address_book` SET ? WHERE sid=? ";
  try {
    const [result] = await db.query(sql, [req.body, sid]);
    output.success = !!result.changedRows;
  } catch (ex) {
    output.error = ex.toString();
  }

  res.json(output);
});
export default router;
