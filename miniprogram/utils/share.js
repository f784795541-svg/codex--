function onShareAppMessage() {
  const message = {
    title: "雾屿轻养，一起轻松管理健康",
    path: "/pages/home/index",
    imageUrl: "/assets/share-cover.png",
  };

  try {
    // Local file paths also render correctly in the developer tool's share preview.
    const imageUrl = `${wx.env.USER_DATA_PATH}/wuyu-share-cover.png`;
    wx.getFileSystemManager().copyFileSync(message.imageUrl, imageUrl);
    return { ...message, imageUrl };
  } catch (error) {
    return message;
  }
}

module.exports = {
  onShareAppMessage,
};
