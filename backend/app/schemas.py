from datetime import date, time

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    name: str
    username: str | None = None
    age: int = Field(ge=1, le=120)
    gender: str
    height_cm: float = Field(gt=0)
    weight_kg: float = Field(gt=0)
    target_weight_kg: float | None = Field(default=None, gt=0)
    target_sleep_hours: float | None = Field(default=None, ge=4, le=12)
    goal: str = "fat_loss"
    activity_level: str = "medium"
    recommendation_mode: str = "home"
    body_type: str | None = None
    target_algorithm: str = "classic"


class UserResponse(UserCreate):
    id: int

    class Config:
        from_attributes = True


class FoodResponse(BaseModel):
    food_id: int
    name: str
    category: str
    calories_per_100g: float
    protein: float
    fat: float
    carbs: float
    is_custom: bool
    aliases: list[str]
    image_key: str
    brand: str | None = None
    serving_size_g: float | None = None
    portion_hint: str | None = None
    cooking_options: list[dict[str, float | str]] = []

    class Config:
        from_attributes = True


class FoodCreate(BaseModel):
    name: str
    category: str = "custom"
    calories_per_100g: float = Field(ge=0)
    protein: float = Field(ge=0)
    fat: float = Field(ge=0)
    carbs: float = Field(ge=0)


class FoodLogCreate(BaseModel):
    user_id: int
    food_id: int
    weight_g: float = Field(gt=0)
    cooking_method: str | None = None
    time: time
    log_date: date | None = None


class WorkoutLogCreate(BaseModel):
    user_id: int
    type: str
    duration_min: int = Field(gt=0)
    calories_burned: float = Field(ge=0)
    workout_time: time | None = None
    log_date: date | None = None


class SleepLogCreate(BaseModel):
    user_id: int
    sleep_start: time
    sleep_end: time
    log_date: date | None = None


class MacroStatus(BaseModel):
    actual: float
    target: float
    status: str


class AuthRegister(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6, max_length=64)
    name: str
    age: int = Field(ge=1, le=120)
    gender: str
    height_cm: float = Field(gt=0)
    weight_kg: float = Field(gt=0)
    target_weight_kg: float | None = Field(default=None, gt=0)
    target_sleep_hours: float | None = Field(default=None, ge=4, le=12)
    goal: str = "fat_loss"
    activity_level: str = "medium"
    recommendation_mode: str = "home"
    body_type: str | None = None
    target_algorithm: str = "classic"


class AuthLogin(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    message: str
    user: UserResponse


class UserUpdateRequest(BaseModel):
    user_id: int
    username: str | None = Field(default=None, min_length=3, max_length=50)
    name: str | None = None
    age: int | None = Field(default=None, ge=1, le=120)
    gender: str | None = None
    height_cm: float | None = Field(default=None, gt=0)
    weight_kg: float | None = Field(default=None, gt=0)
    target_weight_kg: float | None = Field(default=None, gt=0)
    target_sleep_hours: float | None = Field(default=None, ge=4, le=12)
    goal: str | None = None
    activity_level: str | None = None
    recommendation_mode: str | None = None
    body_type: str | None = None
    target_algorithm: str | None = None
    current_password: str | None = Field(default=None, min_length=6, max_length=64)
    new_password: str | None = Field(default=None, min_length=6, max_length=64)


class WorkoutOptionResponse(BaseModel):
    type: str
    label: str
    met: float
    category: str


class WorkoutEstimateRequest(BaseModel):
    user_id: int
    type: str
    duration_min: int = Field(gt=0)


class WorkoutEstimateResponse(BaseModel):
    type: str
    label: str
    met: float
    estimated_calories: float


class UserUpdateResponse(BaseModel):
    message: str
    user: UserResponse


class FoodItemReport(BaseModel):
    food_name: str
    weight_g: float
    cooking_method: str | None = None
    calories: float
    protein: float
    fat: float
    carbs: float
    time: str


class DailyReportResponse(BaseModel):
    user_id: int
    date: date
    goal: str
    total_intake_kcal: float
    total_burned_kcal: float
    total_expenditure_kcal: float
    net_calorie_balance: float
    calorie_target_kcal: float
    protein: MacroStatus
    fat: MacroStatus
    carbs: MacroStatus
    sleep_hours: float
    sleep_status: str
    conclusion: str
    warnings: list[str]
    suggestions: list[str]
    food_items: list[FoodItemReport]


class WeeklyReportResponse(BaseModel):
    user_id: int
    start_date: date
    end_date: date
    average_intake_kcal: float
    average_burned_kcal: float
    average_sleep_hours: float
    average_net_balance: float
    daily_reports: list[DailyReportResponse]


class WeightLogCreate(BaseModel):
    user_id: int
    weight_kg: float = Field(gt=0)
    record_date: date | None = None
    record_time: time | None = None


class WeightLogResponse(BaseModel):
    id: int
    user_id: int
    weight_kg: float
    record_date: date
    record_time: time | None = None

    class Config:
        from_attributes = True


class DashboardSummaryResponse(BaseModel):
    user: UserResponse
    targets: dict[str, float]
    daily_report: DailyReportResponse
    recent_weights: list[WeightLogResponse]
