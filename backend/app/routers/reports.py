from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from .. import dependencies, models, schemas, services
from ..database import get_db


router = APIRouter()


@router.get("/dashboard/summary", response_model=schemas.DashboardSummaryResponse)
def get_dashboard_summary(
    user_id: int | None = Query(None),
    report_date: date | None = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, user_id, current_user)
    return services.build_dashboard_summary(db, user, report_date or services.local_today())


@router.get("/report/daily", response_model=schemas.DailyReportResponse)
def get_daily_report(
    user_id: int | None = Query(None),
    report_date: date | None = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, user_id, current_user)
    return services.compute_daily_report(db, user, report_date or services.local_today())


@router.get("/report/weekly", response_model=schemas.WeeklyReportResponse)
def get_weekly_report(
    user_id: int | None = Query(None),
    start_date: date | None = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, user_id, current_user)
    return services.compute_weekly_report(db, user, start_date or services.local_today())
