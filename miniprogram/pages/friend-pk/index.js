const { get, post } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");

function calendarDays(data) {
  const end = new Date(`${data.today}T12:00:00`);
  const days = [];
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date(end);
    day.setDate(day.getDate() - i);
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    days.push({ date: key, day: day.getDate(), minutes: data.calendar[key] || 0 });
  }
  return days;
}

function habitDays(habit, month) {
  const [year, number] = month.split("-").map(Number);
  const count = new Date(year, number, 0).getDate();
  return Array.from({ length: count }, (_, i) => {
    const key = `${month}-${String(i + 1).padStart(2, "0")}`;
    return { day: i + 1, done: habit.dates.includes(key) };
  });
}

Page({
  data: { loading: true, data: null, days: [], habits: [], month: "", dialog: "", code: "", inputCode: "", habitName: "", error: "" },
  onShow() {
    if (ensureUser()) this.load();
  },
  async load() {
    try {
      const data = await get("/friend-pk/state", this.data.month ? { month: this.data.month } : {}, { cacheMs: 0 });
      const habits = data.habits.map(habit => ({ ...habit, days: habitDays(habit, data.habit_month) }));
      this.setData({ data, habits, days: calendarDays(data), loading: false, dialog: "", error: "", count: Object.keys(data.calendar).length });
    } catch (error) {
      this.setData({ loading: false, error: error.message });
    }
  },
  async showCode() {
    try {
      const result = await post("/friend-pk/code", {});
      this.setData({ dialog: "code", code: result.code, error: "" });
    } catch (error) { this.setData({ error: error.message }); }
  },
  copyCode() { wx.setClipboardData({ data: this.data.code }); },
  showInvite() { this.setData({ dialog: "invite", inputCode: "", error: "" }); },
  closeDialog() { this.setData({ dialog: "", error: "" }); },
  onCodeInput(event) { this.setData({ inputCode: event.detail.value }); },
  showHabit() { this.setData({ dialog: "habit", habitName: "", error: "" }); },
  onHabitInput(event) { this.setData({ habitName: event.detail.value }); },
  async createHabit() {
    try { await post("/friend-pk/habits", { name: this.data.habitName.trim() }); await this.load(); }
    catch (error) { this.setData({ error: error.message }); }
  },
  async toggleHabit(event) {
    try { await post(`/friend-pk/habits/${event.currentTarget.dataset.id}/toggle`, {}); await this.load(); }
    catch (error) { this.setData({ error: error.message }); }
  },
  changeMonth(event) {
    const [year, month] = this.data.data.habit_month.split("-").map(Number);
    const day = new Date(year, month - 1 + Number(event.currentTarget.dataset.step), 1);
    this.setData({ month: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}` });
    this.load();
  },
  async sendInvite() {
    try {
      await post("/friend-pk/invite", { code: this.data.inputCode.trim() });
      await this.load();
    } catch (error) { this.setData({ error: error.message }); }
  },
  async changeChallenge(event) {
    const action = event.currentTarget.dataset.action;
    const challenge = this.data.data.challenge;
    if (action === "leave") {
      const result = await new Promise((resolve) => wx.showModal({ title: "退出挑战", content: "确定结束当前挑战？", success: resolve }));
      if (!result.confirm) return;
    }
    try {
      await post(`/friend-pk/challenge/${challenge.id}/${action}`, {});
      if (action.startsWith("renew") && wx.vibrateShort) wx.vibrateShort({ type: "light" });
      await this.load();
    } catch (error) { this.setData({ error: error.message }); }
  },
  showDay(event) {
    const { date, minutes } = event.currentTarget.dataset;
    wx.showToast({ title: `${date} ${minutes ? `${minutes} 分钟` : "未记录运动"}`, icon: "none" });
  },
  goWorkout() { getApp().globalData.recordTab = "workout"; wx.switchTab({ url: "/pages/record/index" }); },
});
