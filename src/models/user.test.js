import initDB from "./index.js"; // Import hàm khởi tạo database

const testDatabase = async () => {
  try {
    const db = await initDB(); // Đợi models được khởi tạo

    // **Kiểm tra kết nối database**
    await db.sequelize.authenticate();
    console.log("✅ Kết nối database thành công!");

    // Kiểm tra models đã load đúng
    console.log("📌 Các models đã load:");
    console.log(Object.keys(db));

    // Kiểm tra truy vấn với User model
    const users = await db.User.findAll();
    console.log(`📌 Tìm thấy ${users.length} users trong database`);

    // Đóng kết nối database
    await db.sequelize.close();
    console.log("✅ Đã đóng kết nối database.");
  } catch (error) {
    console.error("❌ Lỗi khi test database:", error);
  }
};

// **Gọi test**
testDatabase();
