from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "OpenTruck API"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    gateway_upstream_timeout_seconds: float = 120.0
    openai_codex_base_url: str = "https://chatgpt.com/backend-api/codex/responses"

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "opentruck"
    postgres_user: str = "opentruck"
    postgres_password: str = "opentruck"

    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def postgres_dsn(self) -> str:
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def redis_dsn(self) -> str:
        return f"redis://{self.redis_host}:{self.redis_port}/{self.redis_db}"


settings = Settings()
