import express from "express";
import session from "express-session";
import "dotenv/config";
import { WorkOS } from "@workos-inc/node";

const app = express();
const router = express.Router();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientID = process.env.WORKOS_CLIENT_ID;
const organizationID = "org_01J22H8T7N3FZPYH9PFMA0R359";
const redirectURI = "http://localhost:8000/callback";
const state = "";

router.get("/", async function (req, res) {
  if (session.isloggedin) {
    let before = req.query.before;
    let after = req.query.after;
    console.log("looking for session data:", session.last_name)
    const directories = await workos.directorySync.listDirectories({
      limit: 5,
      before: before,
      after: after,
      order: null,
    });
    before = directories.listMetadata.before;
    after = directories.listMetadata.after;
    res.render("login_successful.ejs", {
      profile: session.profile,
      first_name: session.first_name,
      last_name: session.last_name,
      directories: directories.data,
      before: before,
      after: after,
    });
  } else {
    res.render("index.ejs", { title: "Home" });
  }
});

router.post("/login", (req, res) => {
  const login_type = req.body.login_method;
  const params = {
    clientID: clientID,
    redirectURI: redirectURI,
    state: state,
  };
  if (login_type === "saml") {
    params.organization = organizationID;
  } else {
    params.provider = login_type;
  }
  try {
    const url = workos.sso.getAuthorizationURL(params);

    res.redirect(url);
  } catch (error) {
    res.render("error.ejs", { error: error });
  }
});

router.get("/callback", async (req, res) => {
  let errorMessage;
  try {
    const { code, error } = req.query;

    if (error) {
      errorMessage = `Redirect callback error: ${error}`;
    } else {
      const profile = await workos.sso.getProfileAndToken({
        code,
        clientID,
      });
      const json_profile = JSON.stringify(profile, null, 4);

      session.first_name = profile.profile.first_name;
      session.last_name = profile.profile.last_name;
      session.profile = json_profile;
      session.isloggedin = true;
    }
  } catch (error) {
    errorMessage = `Error exchanging code for profile: ${error}`;
  }

  if (errorMessage) {
    res.render("error.ejs", { error: errorMessage });
  } else {
    res.redirect("/");
  }
});

router.get("/logout", async (req, res) => {
  try {
    session.first_name = null;
    session.profile = null;
    session.isloggedin = null;

    res.redirect("/");
  } catch (error) {
    res.render("error.ejs", { error: error });
  }
});

//directory sync routes

router.get("/directory", async (req, res) => {
  const directories = await workos.directorySync.listDirectories();
  const directory = directories.data.filter(async (directory) => {
    return directory.id == req.query.id;
  })[0];
  res.render("directory.ejs", {
    directory: directory,
    title: "Directory",
  });
});

router.get("/users", async (req, res) => {
  const directoryId = req.query.id;
  const users = await workos.directorySync.listUsers({
    directory: directoryId,
    limit: 100,
  });
  res.render("users.ejs", { users: users.data });
});

export default router;
