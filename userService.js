const mongoose = require('./mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  savedLocations: [{ type: String }],
});

const UserModel = mongoose.model('User', userSchema);

const saveLocationToUser = async (userEmail, location) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: userEmail },
      { $addToSet: { savedLocations: location } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = {
  saveLocationToUser,
};
