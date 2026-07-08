"""baseline schema

Revision ID: 20260706_0001
Revises: None
Create Date: 2026-07-06
"""

from typing import Sequence, Union

from alembic import op


revision: str = "20260706_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            username VARCHAR(50),
            password_hash VARCHAR(255),
            age INTEGER NOT NULL,
            gender VARCHAR(20) NOT NULL,
            height_cm FLOAT NOT NULL,
            weight_kg FLOAT NOT NULL,
            target_weight_kg FLOAT,
            target_sleep_hours FLOAT,
            goal VARCHAR(30) NOT NULL DEFAULT 'fat_loss',
            activity_level VARCHAR(30) NOT NULL DEFAULT 'medium',
            recommendation_mode VARCHAR(30) NOT NULL DEFAULT 'home',
            body_type VARCHAR(30),
            target_algorithm VARCHAR(30) NOT NULL DEFAULT 'classic',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50)")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)")
    op.execute("ALTER TABLE users ALTER COLUMN password_hash TYPE VARCHAR(255)")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS target_weight_kg FLOAT")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS target_sleep_hours FLOAT")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS recommendation_mode VARCHAR(30) DEFAULT 'home'")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS body_type VARCHAR(30)")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS target_algorithm VARCHAR(30) DEFAULT 'classic'")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP")
    op.execute("UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")
    op.execute("UPDATE users SET recommendation_mode = COALESCE(recommendation_mode, 'home')")
    op.execute("UPDATE users SET target_algorithm = COALESCE(target_algorithm, 'classic')")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS food_database (
            food_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL DEFAULT 'other',
            calories_per_100g FLOAT NOT NULL,
            protein FLOAT NOT NULL,
            fat FLOAT NOT NULL,
            carbs FLOAT NOT NULL,
            brand VARCHAR(100),
            serving_size_g FLOAT,
            portion_hint VARCHAR(255),
            cooking_options_json VARCHAR(4000),
            aliases_text VARCHAR(1000),
            search_text VARCHAR(2000),
            source VARCHAR(120),
            source_updated_at VARCHAR(20),
            status VARCHAR(20) NOT NULL DEFAULT 'active',
            is_custom BOOLEAN NOT NULL DEFAULT false
        )
        """
    )
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS brand VARCHAR(100)")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS serving_size_g FLOAT")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS portion_hint VARCHAR(255)")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS cooking_options_json VARCHAR(4000)")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS aliases_text VARCHAR(1000)")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS search_text VARCHAR(2000)")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS source VARCHAR(120)")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS source_updated_at VARCHAR(20)")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'")
    op.execute("ALTER TABLE food_database ADD COLUMN IF NOT EXISTS is_custom BOOLEAN DEFAULT false")
    op.execute("UPDATE food_database SET status = 'active' WHERE status IS NULL")
    op.execute("UPDATE food_database SET is_custom = false WHERE is_custom IS NULL")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS food_search_logs (
            id SERIAL PRIMARY KEY,
            query VARCHAR(200) NOT NULL,
            normalized_query VARCHAR(200) NOT NULL,
            platform VARCHAR(30),
            user_id INTEGER,
            hit_count INTEGER NOT NULL DEFAULT 0,
            chosen_food_id INTEGER,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS food_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            food_id INTEGER NOT NULL,
            weight_g FLOAT NOT NULL,
            cooking_method VARCHAR(80),
            time TIME NOT NULL,
            log_date DATE NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute("ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS cooking_method VARCHAR(80)")
    op.execute("ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP")
    op.execute("UPDATE food_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS workout_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            type VARCHAR(50) NOT NULL,
            duration_min INTEGER NOT NULL,
            calories_burned FLOAT NOT NULL,
            workout_time TIME,
            log_date DATE NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute("ALTER TABLE workout_logs ADD COLUMN IF NOT EXISTS workout_time TIME")
    op.execute("ALTER TABLE workout_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP")
    op.execute("UPDATE workout_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS sleep_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            sleep_start TIME NOT NULL,
            sleep_end TIME NOT NULL,
            log_date DATE NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute("ALTER TABLE sleep_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP")
    op.execute("UPDATE sleep_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")

    op.execute(
        """
        CREATE TABLE IF NOT EXISTS weight_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            weight_kg FLOAT NOT NULL,
            record_date DATE NOT NULL,
            record_time TIME,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    op.execute("ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS record_time TIME")
    op.execute("ALTER TABLE weight_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP")
    op.execute("UPDATE weight_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL")

    op.execute("CREATE INDEX IF NOT EXISTS ix_users_id ON users (id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_users_username ON users (username)")
    op.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users (username) WHERE username IS NOT NULL")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_database_food_id ON food_database (food_id)")
    op.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_food_database_name_unique ON food_database (name)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_database_name ON food_database (name)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_food_database_brand ON food_database (brand)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_food_database_category ON food_database (category)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_food_database_status ON food_database (status)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_food_database_search_text_trgm ON food_database USING gin (search_text gin_trgm_ops)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_search_logs_id ON food_search_logs (id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_search_logs_normalized_query ON food_search_logs (normalized_query)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_search_logs_platform ON food_search_logs (platform)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_search_logs_user_id ON food_search_logs (user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_search_logs_created_at ON food_search_logs (created_at)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_logs_id ON food_logs (id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_logs_user_id ON food_logs (user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_logs_food_id ON food_logs (food_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_food_logs_log_date ON food_logs (log_date)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_workout_logs_id ON workout_logs (id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_workout_logs_user_id ON workout_logs (user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_workout_logs_log_date ON workout_logs (log_date)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_sleep_logs_id ON sleep_logs (id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_sleep_logs_user_id ON sleep_logs (user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_sleep_logs_log_date ON sleep_logs (log_date)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_weight_logs_id ON weight_logs (id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_weight_logs_user_id ON weight_logs (user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_weight_logs_record_date ON weight_logs (record_date)")

    _add_fk_if_missing("food_logs", "fk_food_logs_user_id_users", "user_id", "users", "id")
    _add_fk_if_missing("food_logs", "fk_food_logs_food_id_food_database", "food_id", "food_database", "food_id")
    _add_fk_if_missing("workout_logs", "fk_workout_logs_user_id_users", "user_id", "users", "id")
    _add_fk_if_missing("sleep_logs", "fk_sleep_logs_user_id_users", "user_id", "users", "id")
    _add_fk_if_missing("weight_logs", "fk_weight_logs_user_id_users", "user_id", "users", "id")


def downgrade() -> None:
    pass


def _add_fk_if_missing(table: str, constraint: str, column: str, ref_table: str, ref_column: str) -> None:
    op.execute(
        f"""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint WHERE conname = '{constraint}'
            ) THEN
                ALTER TABLE {table}
                ADD CONSTRAINT {constraint}
                FOREIGN KEY ({column}) REFERENCES {ref_table} ({ref_column});
            END IF;
        END
        $$;
        """
    )
