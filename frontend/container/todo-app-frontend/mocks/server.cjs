/* eslint-disable  @typescript-eslint/no-require-imports */ //ESLintのrequireを使うなという警告を無効化

const jsonServer = require("json-server"); //json-serverがESModules未対応
const server = jsonServer.create();
const router = jsonServer.router("./dbForDev.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ログインAPIモック
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value();
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    res.jsonp({
      token: "dummy-token",
      user: { id: user.id, email: user.email },
    });
  } else {
    res.status(401).jsonp({ message: "メールアドレスまたはパスワードが正しくありません" });
  }
});

// サインアップAPIモック
server.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value();
  if (users && users.find((u) => u.email === email)) {
    res.status(409).jsonp({ message: "このメールアドレスは既に登録されています" });
    return;
  }
  const id = (users ? users.length : 0) ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser = { id, email, password };
  if (router.db.get("users")) {
    router.db.get("users").push(newUser).write();
  } else {
    router.db.set("users", []).write();
    router.db.get("users").push(newUser).write();
  }
  res.jsonp({
    token: "dummy-token",
    user: { id, email },
  });
});

// その他のリクエストは通常のjson-serverに委譲
server.use(router);

const port = 3001;
server.listen(port, () => {
  console.log(`JSON Server with auth mock is running at http://localhost:${port}`);
});
