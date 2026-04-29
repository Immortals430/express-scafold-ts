import User from "./user.schema.js";

export default class UserRepository {
  async findUserByEmail(email: string) {
    return await User.findOne({ email }).select("+password");
  }

  async createUser(userDetail: {
    email: string;
    username: string;
    password: string;
  }) {
    await User.create({
      email: userDetail.email,
      username: userDetail.username,
      password: userDetail.password,
    });
    return;
  }

  async updateUserPassword(email: string, password: string) {
    await User.findOneAndUpdate({ email }, { password });
    return;
  }
}
