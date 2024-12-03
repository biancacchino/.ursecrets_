import { describe, it, expect } from "vitest";
import { checkAuth, checkNotAuth} from "server_side"



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