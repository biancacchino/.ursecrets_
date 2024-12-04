import { describe, it, expect, vi } from "vitest";
import { checkAuth, checkNotAuth} from "server_side"

// mock diaryentries
const diaryEntries = {};

// mock user data
const mockUserID = "mockUser";
const mockDate = "2024-12-03";
const mockContent = "saw a baddie with a gyattie today. perioddd";
const mockEntries = { [mockDate]: mockContent};

// mock middleware
const mockReq = (isAuthenticated, userID = mockUserID) => ({
  isAuthenticated: () => isAuthenticated,
  user: { userID },
  body: {},
  params: {},
});
const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  res.redirect = vi.fn();
  return res;
};

describe("auth tests", () => {
  it("checkAuth should call next if authenticated", () => {
    const req = mockReq(true);
    const res = mockRes();
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    checkAuth(req, res, next);
    expect(nextCalled).toBe(true);
  });

  it("checkAuth should redirect if not authenticated", () => {
    const req = mockReq(false);
    const res = mockRes();
    const next = vi.fn();

    checkAuth(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith("/");
  });

  it("checkNotAuth should redirect if authenticated", () => {
    const req = mockReq(true);
    const res = mockRes();
    const next = vi.fn();

    checkNotAuth(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith("/years");
  });

  it("checkNotAuth should call next if not authenticated"