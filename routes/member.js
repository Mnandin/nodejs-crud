import express from "express";
import dayjs from "dayjs";
import { z } from "zod";
import db from "../utils/mysql2-connect.js";

const router = express.Router();

router.use((req, res, next) => {
  const whiteList = ["/"];
  let path = req.url.split("?")[0];
  if (!whiteList.includes(path)) {
    if (!req.session.admin) {
      return res.redirect("/login");
    }
  }

  next();
});

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
  if (req.session.admin) {
    res.render("member/list", data);
  } else {
    res.render("member/list-no-admin", data);
  }
});

router.get("/add", async (req, res) => {
  res.locals.title = "Add new member - " + res.locals.title;
  res.locals.pageName = "mb-add";
  res.render("member/add");
});

router.post("/add", async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    errors: {},
    error: "",
  };

  let isPass = true;

  const schemaName = z.string().min(2, { message: "It's too short" });
  const schemaEmail = z.string().email({ message: "Invalid email" });

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

  let birthday = req.body.birthday;
  if (dayjs(birthday, "YYYY-MM-DD", true).isValid()) {
    birthday = dayjs(birthday).format("YYYY-MM-DD");
  } else {
    birthday = null;
  }
  req.body.birthday = birthday;

  let result = {};
  if (isPass) {
    const checkEmailSql = "SELECT `id` FROM `mb_user` WHERE `email` = ?";

    try {
      const [rows] = await db.query(checkEmailSql, req.body.email);

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
      const [rows] = await db.query(checkPhoneSql, req.body.phone);

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

    req.body.created_at = new Date();
    const sql = "INSERT INTO `mb_user` SET ? ";

    try {
      [result] = await db.query(sql, [req.body]);
      output.success = !!result.affectedRows;
    } catch (ex) {}
  }

  res.json(output);
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
    errors: {},
    error: "",
  };
  let isPass = true;

  const schemaName = z.string().min(3, { message: "It's too short" });
  const schemaEmail = z.string().email({ message: "Invalid email" });

  let id = +req.params.id || 0;
  const { email, phone, name } = req.body;

  const r1 = schemaName.safeParse(name);
  if (!r1.success) {
    isPass = false;
    output.errors.name = r1.error.issues[0].message;
  }
  const r2 = schemaEmail.safeParse(email);
  if (!r2.success) {
    isPass = false;
    output.errors.email = r2.error.issues[0].message;
  }

  let birthday = req.body.birthday;

  if (dayjs(birthday, "YYYY-MM-DD", true).isValid()) {
    birthday = dayjs(birthday).format("YYYY-MM-DD");
  } else {
    birthday = null;
  }

  if (isPass) {
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

    const sql =
      "UPDATE `mb_user` SET name=?, email=?, phone=?, birthday=? WHERE id=? ";
    try {
      const [result] = await db.query(sql, [name, email, phone, birthday, id]);
      output.success = !!result.changedRows;
    } catch (ex) {
      output.error = ex.toString();
    }
  }

  res.json(output);
});

router.delete("/:id", async (req, res) => {
  let id = +req.params.id || 0;
  const output = {
    success: false,
    id,
  };

  if (id >= 1) {
    try {
      const sql = `DELETE FROM mb_user WHERE id=${id}`;
      const [result] = await db.query(sql);
      output.success = !!result.affectedRows;
    } catch (ex) {}
  }

  res.json(output);
});

export default router;
