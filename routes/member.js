import express from "express";
import dayjs from "dayjs";
import { z } from "zod";
import db from "../utils/mysql2-connect.js";

const router = express.Router();

const getListData = async (req) => {
  let page = +req.query.page || 1;

  let keyword = req.query.keyword || "";

  let where = " WHERE 1 ";
  if (keyword) {
    const keywordEsc = db.escape("%" + keyword + "%");
    where += ` AND ( 
        \`name\` LIKE ${keywordEsc} 
        OR 
        \`phone\` LIKE ${keywordEsc} 
        ) `;
  }
  // const dateFormat = "YYYY-MM-DD";

  // let date_begin = req.query.date_begin || "";
  // if (dayjs(date_begin, dateFormat, true).isValid()) {
  //   date_begin = dayjs(date_begin).format(dateFormat);
  // } else {
  //   date_begin = "";
  // }
  // if (date_begin) {
  //   where += ` AND birthday >= '${date_begin}' `;
  // }

  // let date_end = req.query.date_end || "";
  // if (dayjs(date_end, dateFormat, true).isValid()) {
  //   date_end = dayjs(date_end).format(dateFormat);
  // } else {
  //   date_end = "";
  // }
  // if (date_end) {
  //   where += ` AND birthday <= '${date_end}' `;
  // }

  if (page < 1) {
    return { success: false, redirect: "?page=1" };
  }
  const perPage = 15;
  const t_sql = `SELECT COUNT(1) totalRows FROM mb_user ${where}`;
  const [[{ totalRows }]] = await db.query(t_sql);

  let rows = [];
  let totalPages = 0;
  if (totalRows) {
    totalPages = Math.ceil(totalRows / perPage);
    if (page > totalPages) {
      const newQuery = { ...req.query, page: totalPages };
      const qs = new URLSearchParams(newQuery).toString();
      return { success: false, redirect: `?` + qs };
    }
    const sql = `SELECT * FROM mb_user
      ${where}
      ORDER BY id DESC 
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
  res.locals.title = "Member list - " + res.locals.title;
  res.locals.pageName = "mb-list";
  const data = await getListData(req);
  if (data.redirect) {
    return res.redirect(data.redirect);
  }
  //   if (req.session.admin) {
  //     res.render("address-book/list", data);
  //   } else {
  //     res.render("address-book/list-no-admin", data);
  //   }
  res.render("member/list", data);
});

router.get("/edit/:id", async (req, res) => {
  let id = +req.params.id || 0;
  const sql = `SELECT * FROM mb_user WHERE id=? `;
  const [rows] = await db.query(sql, [id]);
  if (!rows.length) {
    // 沒有該筆資料時, 直接跳轉
    return res.redirect("/member");
  }
  res.locals.title = "Edit - " + res.locals.title;
  res.locals.pageName = "mb-edit";

  if (rows[0].birthday) {
    rows[0].birthday = dayjs(rows[0].birthday).format("YYYY-MM-DD");
  }

  res.render("member/edit", rows[0]);
});

router.put("/edit/:id", async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    error: "",
  };
  let id = +req.params.id || 0;
  const { email, phone } = req.body;

  // TODO: 表單資料欄位檢查
  const checkEmailSql = "SELECT `id` FROM `mb_user` WHERE `email` = ?";

  try {
    const [rows] = await db.query(checkEmailSql, email);

    if (rows.length) {
      output.code = 1;
      output.error = "This email exists. Try another";
      res.json(output);
      return;
    }
  } catch (ex) {
    console.log(ex);
    res.json(output);
    return;
  }

  const checkPhoneSql = "SELECT `id` FROM `mb_user` WHERE `phone` = ?";

  try {
    const [rows] = await db.query(checkPhoneSql, phone);

    if (rows.length) {
      output["code"] = 2;
      output["error"] = "This phone number has been registered already";
      res.json(output);
      return;
    }
  } catch (ex) {
    console.log("Checking phone error" + ex);
    output["error"] = "SQL error" + ex;
    res.json(output);
    return;
  }

  const sql = "UPDATE `mb_user` SET ? WHERE id=? ";
  try {
    const [result] = await db.query(sql, [req.body, id]);
    output.success = !!result.changedRows;
  } catch (ex) {
    output.error = ex.toString();
  }

  res.json(output);
});

export default router;
