import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/user";

export async function register(user) {
  return await http.post(apiEndpoint, {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    city: user.city,
    state: user.state,
    zip: user.zip,
    password: user.password,
    savingsAccount: user.savingsAccount,
    checkingAccount: user.checkingAccount,
  });
}

export async function deleteAccount(details) {
  console.log("DETAILS: ", details);
  return await http.delete(apiEndpoint, {
    data: {
      accountType: details.accountType,
      accountNumber: details.accountNumber,
    },
  });
}
