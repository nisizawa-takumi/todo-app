import { login, signup, checkAuth } from "./apiClient";

describe("auth apiClient", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("login: success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email: "test@example.com" }),
    });
    const res = await login({ email: "test@example.com", password: "pass" });
    expect(res).toEqual({ email: "test@example.com" });
    expect(global.fetch).toHaveBeenCalled();
  });

  it("login: failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "ログインに失敗しました" }),
    });
    await expect(login({ email: "fail@example.com", password: "wrong" })).rejects.toThrow("ログインに失敗しました");
  });

  it("signup: success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email: "new@example.com" }),
    });
    const res = await signup({ email: "new@example.com", password: "pass" });
    expect(res).toEqual({ email: "new@example.com" });
  });

  it("signup: failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "アカウント作成に失敗しました" }),
    });
    await expect(signup({ email: "fail@example.com", password: "pass" })).rejects.toThrow(
      "アカウント作成に失敗しました"
    );
  });

  it("checkAuth: success", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ email: "test@example.com" }),
    });
    const res = await checkAuth();
    expect(res).toEqual({ email: "test@example.com" });
  });

  it("checkAuth: failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    await expect(checkAuth()).rejects.toThrow("未認証");
  });
});
