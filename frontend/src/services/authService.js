import http from "./httpService";
import jwtDecode from "jwt-decode";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/auth";
const tokenKey = "token.bank";

http.setJwt(getJwt());

export async function login(email, password) {
  try {
    const response = await http.post(apiEndpoint, { email, password });
    if (response && response.status === 200) {
      const jwt = response.data;
      localStorage.setItem(tokenKey, jwt);
      return true;
    }
  } catch (ex) {
    if (ex.response && ex.response.status === 400) {
      return false;
    }
  }
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
  //actual code
  try {
    const jwt = localStorage.getItem(tokenKey);
    console.log("RETURNING DATA");
    return jwtDecode(jwt);
  } catch (ex) {
    console.log("RETURNING NULL");
    return null;
  }

  // -----tested using below values------
  // return null;
  // return {
  //   _id: "1234",
  //   name: "Himaja Chandaluri",
  //   email: "himaja.chandaluri@gmail.com",
  //   isAdmin: true,
  //   iat: 1617904344,
  // };
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};

// const loggedIn = true;
// const user = true;
// const admin = false;

// export { loggedIn, user, admin };
