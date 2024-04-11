import express from "express";
import bcrypt from "bcryptjs";
import memberRouter from "./routes/member.js"
import session from "express-session";
import mysqlSession from "express-mysql-session";
import db from "./utils/mysql2-connect.js";
import cors from "cors";

const MysqlStore = mysqlSession(session);
const sessionStore = new MysqlStore({}, db);

const app = express();

app.set("view engine", "ejs");

// top-level middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const corsOptions = {
  credentials: true,
  origin: (origin, callback)=>{
    // console.log({origin});
    callback(null, true);
  }
}
app.use(cors(corsOptions));
app.use(
  session({
    saveUninitialized: true, // When the user hasn't used session yet, if still want to save the session
    resave: true, // when the session content hasn't changed and still want to force save it
    secret: "kdjfsk94859348JHGJK85743",
    store: sessionStore,
  })
);

// self made middlewares
app.use((req, res, next) => {
  res.locals.title = "Some website";
  res.locals.pageName = "";
  res.locals.session = req.session; // let ejs be able to session
  res.locals.originalUrl = req.originalUrl;
  next();
});

app.get("/", (req, res) => {
  res.locals.title = "Home - " + res.locals.title;
  res.locals.pageName = "home";
  res.render("home", { name: "Linda" });
});

app.use("/member", memberRouter);

app.get("/login", (req, res) => {
  if(req.session.admin){
    return res.redirect("/");
  }
  res.render("login");
});

app.post("/login", async (req, res) => {
  let {account, password} = req.body || {};
  const output = {
    success: false,
    error: "",
    code: 0,
    postData: req.body,
  };
  if(!account || !password){
    output.error = "Information incomplete";
    output.code = 400;
    return res.json(output);
  }
  account = account.trim();
  password = password.trim().toString();

  const sql = "SELECT * FROM mb_team_member WHERE user_name=?";
  const [rows] = await db.query(sql, [account]);
  
  if(!rows.length){
    // Account is wrong
    output.error = "Account or password is wrong";
    output.code = 420;
    return res.json(output);
  }
  const row = rows[0];
  try {
    const result = await bcrypt.compare(password, row.password);
    if(result){
      output.success = true;
      req.session.admin = {
        id: row.id,
        username: account,
      };
    } else {
      output.error = "Account or password is wrong";
      output.code = 450;
    }
  } catch (ex) {
    console.log(ex);
  }
  
  res.json(output);
});

app.get("/logout", (req, res) => {
  if(req.session?.admin){
    delete req.session.admin;
  }
  if(req.query.u){
    res.redirect(req.query.u);
  } else {
    res.redirect("/");
  }

});

app.use("/", express.static("public"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/jquery", express.static("node_modules/jquery/dist"));

app.use((req, res) => {
  res.status(404).send(`<h2>404 走錯路了</h2>`);
});

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
