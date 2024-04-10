import express from "express";
import db from "../utils/mysql2-connect.js";
import dayjs from "dayjs";
import { z } from "zod";

const router = express.Router();

// router's Top Level middleware
router.use((req, res, next) => {
  // SELECT ab.*, li.sid FROM `address_book` ab
  // LEFT JOIN (SELECT * FROM `ab_likes` WHERE member_sid=4) li
  // ON ab.sid = li.ab_sid
  // WHERE 1

  // const whiteList = ['/', '/api']
  //   let path = req.url.split('?')[0] // get the front part of ?, not the query string
  //   if(!whiteList.includes(path)){
  //     // if the path is not in the white list
  //     if(! req.session.admin){
  //       return res.redirect(`/login?u=${req.originalUrl}`)
  //     }
  //   }

  next();
});

const getListData = async (req) => {
  const member_sid = req.my_jwt?.id || 0
  console.log(member_sid);
  let page = +req.query.page || 1;
  let keyword = req.query.keyword || "";

  let where = " WHERE 1 ";
  if (keyword) {
    // where += ` AND \`name\` LIKE '%${keyword}%' ` // this is a wrong way to write it. Will have a sql injection problem
    const keywordEsc = db.escape("%" + keyword + "%");
    where += ` AND (ab.\`name\` LIKE ${keywordEsc} OR ab.\`mobile\` LIKE ${keywordEsc}) `;
  }

  const dateFormat = "YYYY-MM-DD";

  let begin_date = req.query.begin_date || "";
  if (dayjs(begin_date, dateFormat, true).isValid()) {
    begin_date = dayjs(begin_date).format(dateFormat);
  } else {
    begin_date = "";
  }
  if (begin_date) {
    where += ` AND ab.birthday >= '${begin_date}' `;
  }

  let end_date = req.query.end_date || "";
  if (dayjs(end_date, dateFormat, true).isValid()) {
    end_date = dayjs(end_date).format(dateFormat);
  } else {
    end_date = "";
  }
  if (end_date) {
    where += ` AND ab.birthday <= '${end_date}' `;
  }

  if (page < 1) {
    return { success: false, redirect: "?page=1" };
  }
  const perPage = 3;
  const t_sql = `SELECT COUNT(1) totalRows FROM address_book ab ${where}`;
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
    const sql = `SELECT ab.*, li.sid like_sid FROM address_book ab
    LEFT JOIN (SELECT * FROM ab_likes WHERE member_sid=${member_sid}) li
    ON ab.sid = li.ab_sid
    ${where} 
    ORDER BY ab.sid DESC LIMIT ${(page - 1) * perPage}, ${perPage}`;

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
    member_sid: member_sid,
  };
};

// async functions always returns promise
router.get("/", async (req, res) => {
  res.locals.pageName = "ab-list";
  const data = await getListData(req);
  if (data.redirect) {
    return res.redirect(data.redirect);
  }

  if (req.session.admin) {
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

  // TODO: need to check the column information

  const schemaName = z
    .string()
    .min({ message: "Name should be at least two characters" });
  const schemaEmail = z
    .string()
    .email({ message: "Please enter a correct email" });

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
  if (dayjs(birthday, "YYYY-MM-DD").isValid()) {
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
});

// delete single id
router.delete("/:sid", async (req, res) => {
  let sid = +req.params.sid || 0;
  const output = {
    success: false,
    sid,
  };

  if (sid >= 1) {
    const sql = `DELETE from address_book where sid = ${sid}`;
    const [result] = await db.query(sql);
    output["success"] = !!result.affectedRows;
  }
  res.json(output);
});

router.get("/edit/:sid", async (req, res) => {
  let sid = req.params.sid || 0;
  const sql = `SELECT * FROM address_book where sid =? `;
  const [rows] = await db.query(sql, [sid]);

  res.locals.pageName = "ab-edit";

  if (!rows.length) {
    // if there is no information, it will be redirected
    return res.redirect("/address-book");
  }

  if (rows[0].birthday) {
    rows[0].birthday = dayjs(rows[0].birthday).format("YYYY-MM-DD");
  }
  res.render("address-book/edit", rows[0]);
});

// get one information
router.get("/:sid", async (req, res) => {
  let sid = req.params.sid || 0;
  const sql = `SELECT * FROM address_book where sid =? `;
  const [rows] = await db.query(sql, [sid]);

  if (!rows.length) {
    // if there is no information, it will be redirected
    return res.json({ success: false, msg: "There is no information" });
  }

  if (rows[0].birthday) {
    rows[0].birthday = dayjs(rows[0].birthday).format("YYYY-MM-DD");
  }
  res.json({ success: true, data: rows[0] });
});

router.put("/edit/:sid", async (req, res) => {
  const output = {
    success: false,
    bodyData: req.body,
    error: "",
  };

  let sid = req.params.sid || 0;

  // TODO: need to check the information's validation

  const sql = "UPDATE `address_book` SET ? WHERE sid = ?";

  // if you're adding ? in the sql, and putting the body in the query, better put it in a try catch.
  try {
    const [result] = await db.query(sql, [req.body, sid]);
    output.success = !!result.changedRows;
  } catch (ex) {
    output.error = ex.toString();
  }

  res.json(output);
});

// add or remove liked items
router.get("/toggle-like/:ab_sid", async (req, res) => {
  const output = {
    success: false,
    action: "", // add, remove
    error: "",
    code: 0,
  };

  if (!req.my_jwt?.id) {
    output.code = 430;
    output.error = "Not logged in";
    return res.json(output);
  }

  //TODO: if the member is authorized
  const member_sid = req.my_jwt.id;

  // first make sure if the product exists
  const sql1 = "SELECT sid FROM address_book WHERE sid=?";
  const [rows1] = await db.query(sql1, [req.params.ab_sid]);
  if (!rows1.length) {
    output.code = 401;
    output.error = "There is no this product";
    return res.json(output);
  }
  const sql2 = "SELECT * from ab_likes WHERE `member_sid`=? AND `ab_sid`=?";
  const [row2] = await db.query(sql2, [member_sid, req.params.ab_sid]);
  if (row2.length) {
    // the product is in the liked table, have to remove
    const sql = `DELETE from ab_likes WHERE sid=${row2[0].sid}`;
    const [result] = await db.query(sql);
    if (result.affectedRows) {
      output.success = true;
      output.action = "remove";
    } else {
      output.code = 402;
      output.error = "Remove unsuccessful";
      return res.json(output);
    }
  } else {
    // add
    const sql = "INSERT INTO ab_likes (member_sid, ab_sid) VALUES (?, ?)";
    const [result] = await db.query(sql, [member_sid, req.params.ab_sid]);
    if (result.affectedRows) {
      output.success = true;
      output.action = "add";
    } else {
      output.code = 403;
      output.error = "Add unsuccessful";
      return res.json(output);
    }
  }
  return res.json(output);
});

export default router;
