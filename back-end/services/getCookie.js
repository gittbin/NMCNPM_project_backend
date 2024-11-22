function getCookie(cookieName) {
  const targetCookie = document.cookie
      .split("; ")
      .find(cookie => cookie.startsWith(`${cookieName}=`));

  if (!targetCookie) return null; // Không tìm thấy cookie

  try {
      const parsedCookie = JSON.parse(decodeURIComponent(targetCookie.split("=")[1]));
      return parsedCookie || null; // Trả về toàn bộ đối tượng JSON
  } catch (error) {
      console.error("Lỗi khi xử lý cookie:", error);
      return null;
  }
}

module.exports= {getCookie}