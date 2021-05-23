import { db } from "../firebase";

const getUserDocById = async (id) => {
  try {
    const res = await db.collection("users").doc(id).get();
    return {
      id: res.id,
      ...res.data(),
    };
  } catch (error) {
    throw error;
  }
};

export { getUserDocById };
