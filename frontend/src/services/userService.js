import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

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

export async function getUserDetails(id) {
  return await http.get(apiEndpoint + `/${id}`);
}

export async function makeTransfer(data) {
  return await http.post(apiUrl + "/user/transactions", {
    senderId: data.userId,
    typeOfTransfer: data.typeOfTransfer,
    fromAccount: data.fromAccount,
    toAccount: data.toAccount,
    amount: data.amount,
    frequency: data.frequency,
    startOn: data.startOn,
    endsOn: data.endsOn,
    routingNumber: data.routingNumber,
  });
}
