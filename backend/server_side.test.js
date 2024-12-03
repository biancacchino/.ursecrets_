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

  it("checkNotAuth should call next if not authenticated", () => {
    const req = mockReq(false);
    const res = mockRes();
    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    checkNotAuth(req, res, next);
    expect(nextCalled).toBe(true);
  });
});

describe("diary routes", () => {
  it("should save a diary entry", () => {
    const req = mockReq(true);
    req.body = { date: mockDate, content: mockContent };
    const res = mockRes();

    diaryEntries[req.user.userID] = {}; // mock diary storage
    const saveDiaryEntry = (req, res) => {
      const userID = req.user.userID;
      const { date, content } = req.body;

      if (!diaryEntries[userID]) {
        diaryEntries[userID] = {};
      }

      diaryEntries[userID][date] = content;
      res.json({ success: true, message: "diary entry saved successfully" });
    };

    saveDiaryEntry(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "diary entry saved successfully",
    });
    expect(diaryEntries[mockUserID][mockDate]).toBe(mockContent);
  });

  it("should get a diary entry for a specific date", () => {
    const req = mockReq(true);
    req.params.date = mockDate;
    const res = mockRes();

    diaryEntries[mockUserID] = mockEntries; // mock diary storage
    const getDiaryEntry = (req, res) => {
      const userID = req.user.userID;
      const date = req.params.date;

      const userEntries = diaryEntries[userID] || {};
      const entry = userEntries[date];

      if (entry) {
        res.json({ success: true, entry });
      } else {
        res.json({ success: false, message: "No entry for this date." });
      }
    };

    getDiaryEntry(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, entry: mockContent });
  });

  it("should return an error for a non-existent diary entry", () => {
    const req = mockReq(true);
    req.params.date = "2024-11-24"; // non-existent date
    const res = mockRes();

    diaryEntries[mockUserID] = mockEntries; // mock diary storage
    const getDiaryEntry = (req, res) => {
      const userID = req.user.userID;
      const date = req.params.date;

      const userEntries = diaryEntries[userID] || {};
      const entry = userEntries[date];

      if (entry) {
        res.json({ success: true, entry });
      } else {
        res.json({ success: false, message: "No entry for this date." });
      }
    };

    getDiaryEntry(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No entry for this date.",
    });
  });

  it("should get all diary entries for a user", () => {
    const req = mockReq(true);
    const res = mockRes();

    diaryEntries[mockUserID] = mockEntries; // mock diary storage
    const getAllEntries = (req, res) => {
      const userID = req.user.userID;
      const userEntries = diaryEntries[userID] || {};

      res.json({ success: true, entries: userEntries });
    };

    getAllEntries(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      entries: mockEntries,
    });
  });
});



describe("auth tests", () => {
    it("checkAuth should call next if authenticated", () => {
      const req = { isAuthenticated: () => true };
      const res = { redirect: () => {} }; 
      let nextCalled = false;
      const next = () => { nextCalled = true; };
  
      checkAuth(req, res, next);
  
      expect(nextCalled).toBe(true);
    });
  
    it("checkAuth should redirect if not authenticated", () => {
      const req = { isAuthenticated: () => false }; 
      let redirectCalledWith = null;
      const res = {
        redirect: (path) => { redirectCalledWith = path; }, 
      };
      const next = () => {};
  
      checkAuth(req, res, next);
  
      expect(redirectCalledWith).toBe("/");
    });
  
    it("checkNotAuth should redirect if authenticated", () => {
      const req = { isAuthenticated: () => true }; 
      let redirectCalledWith = null;
      const res = {
        redirect: (path) => { redirectCalledWith = path; }, 
      };
      const next = () => {};
  
      checkNotAuth(req, res, next);
  
      expect(redirectCalledWith).toBe("/years");
    });
  
    it("checkNotAuth should call next if not authenticated", () => {
      const req = { isAuthenticated: () => false }; 
      const res = { redirect: () => {} }; 
      let nextCalled = false;
      const next = () => { nextCalled = true; }; 
  
      checkNotAuth(req, res, next);
  
      expect(nextCalled).toBe(true);
    });
  });