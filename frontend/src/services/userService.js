import http from "./httpService";

const apiUrl = "http://localhost:3900/users";

export async function register(user) {
  const response = await http.post(apiUrl, {
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
  return response;
}
