declare interface Env {
  readonly NG_APP_API_BASE_URL: string;
  readonly NG_APP_DAYS_RANGE: number;
  readonly NG_APP_DAYS_RANGE_ADMIN: number;
  readonly NG_APP_TIMEPICKER_INTERVAL_MINUTES: number;
}

declare interface ImportMeta {
  readonly env: Env;
}
