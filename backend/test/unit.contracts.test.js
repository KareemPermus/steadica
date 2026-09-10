const ROUTES = [
  {
    "method": "GET",
    "path": "/api/health",
    "request_path": "/api/health",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "status"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/habits",
    "request_path": "/api/habits",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [],
    "expects_json": true
  },
  {
    "method": "POST",
    "path": "/api/habits",
    "request_path": "/api/habits",
    "auth_required": false,
    "success_status": 201,
    "sample_body": null,
    "response_keys": [
      "categoryId",
      "color",
      "createdAt",
      "description",
      "frequency",
      "id",
      "name"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/habits/:id",
    "request_path": "/api/habits/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "categoryId",
      "color",
      "createdAt",
      "currentStreak",
      "description",
      "frequency",
      "id",
      "longestStreak",
      "name",
      "tags"
    ],
    "expects_json": true
  },
  {
    "method": "PUT",
    "path": "/api/habits/:id",
    "request_path": "/api/habits/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "categoryId",
      "color",
      "createdAt",
      "description",
      "frequency",
      "id",
      "name"
    ],
    "expects_json": true
  },
  {
    "method": "DELETE",
    "path": "/api/habits/:id",
    "request_path": "/api/habits/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "message"
    ],
    "expects_json": true
  },
  {
    "method": "PUT",
    "path": "/api/habits/:id/tags",
    "request_path": "/api/habits/1/tags",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/checkins",
    "request_path": "/api/checkins",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [],
    "expects_json": true
  },
  {
    "method": "POST",
    "path": "/api/checkins",
    "request_path": "/api/checkins",
    "auth_required": false,
    "success_status": 201,
    "sample_body": null,
    "response_keys": [
      "completed",
      "date",
      "habitId",
      "id",
      "note"
    ],
    "expects_json": true
  },
  {
    "method": "PUT",
    "path": "/api/checkins/:id",
    "request_path": "/api/checkins/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "completed",
      "date",
      "habitId",
      "id",
      "note"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/analytics/dashboard",
    "request_path": "/api/analytics/dashboard",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "overallCompletionRate",
      "todayCompleted",
      "todayTotal",
      "topStreaks",
      "totalHabits"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/analytics/progress",
    "request_path": "/api/analytics/progress",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "byCategory",
      "byHabit",
      "daily"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/reminders",
    "request_path": "/api/reminders",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [],
    "expects_json": true
  },
  {
    "method": "POST",
    "path": "/api/reminders",
    "request_path": "/api/reminders",
    "auth_required": false,
    "success_status": 201,
    "sample_body": null,
    "response_keys": [
      "days",
      "enabled",
      "habitId",
      "id",
      "time"
    ],
    "expects_json": true
  },
  {
    "method": "PUT",
    "path": "/api/reminders/:id",
    "request_path": "/api/reminders/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "days",
      "enabled",
      "habitId",
      "id",
      "time"
    ],
    "expects_json": true
  },
  {
    "method": "DELETE",
    "path": "/api/reminders/:id",
    "request_path": "/api/reminders/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "message"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/categories",
    "request_path": "/api/categories",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [],
    "expects_json": true
  },
  {
    "method": "POST",
    "path": "/api/categories",
    "request_path": "/api/categories",
    "auth_required": false,
    "success_status": 201,
    "sample_body": null,
    "response_keys": [
      "color",
      "id",
      "name"
    ],
    "expects_json": true
  },
  {
    "method": "PUT",
    "path": "/api/categories/:id",
    "request_path": "/api/categories/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "color",
      "id",
      "name"
    ],
    "expects_json": true
  },
  {
    "method": "DELETE",
    "path": "/api/categories/:id",
    "request_path": "/api/categories/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "message"
    ],
    "expects_json": true
  },
  {
    "method": "GET",
    "path": "/api/tags",
    "request_path": "/api/tags",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [],
    "expects_json": true
  },
  {
    "method": "POST",
    "path": "/api/tags",
    "request_path": "/api/tags",
    "auth_required": false,
    "success_status": 201,
    "sample_body": null,
    "response_keys": [
      "id",
      "name"
    ],
    "expects_json": true
  },
  {
    "method": "DELETE",
    "path": "/api/tags/:id",
    "request_path": "/api/tags/1",
    "auth_required": false,
    "success_status": 200,
    "sample_body": null,
    "response_keys": [
      "message"
    ],
    "expects_json": true
  }
];
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3001";

describe("API unit contracts", () => {
  describe("missing required field → 400/422", () => {
    for (const route of ROUTES) {
      const body = route.sample_body;
      if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).length < 2) continue;
      for (const omitKey of Object.keys(body)) {
        it(`${route.method} ${route.path} missing '${omitKey}' → 400/422`, async () => {
          const partial = Object.fromEntries(Object.entries(body).filter(([k]) => k !== omitKey));
          const requestPath = route.request_path || route.path;
          const response = await fetch(`${BASE_URL}${requestPath}`, {
            method: route.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partial),
          });
          expect([400, 422]).toContain(response.status);
        });
      }
    }
  });

  describe("auth rejection → 401", () => {
    for (const route of ROUTES) {
      if (!route.auth_required) continue;
      it(`${route.method} ${route.path} without token → 401`, async () => {
        const requestPath = route.request_path || route.path;
        const response = await fetch(`${BASE_URL}${requestPath}`, { method: route.method });
        expect(response.status).toBe(401);
      });
    }
  });

  describe("wrong method → 405", () => {
    for (const route of ROUTES) {
      const wrong = route.method === "GET" ? "POST" : "GET";
      it(`wrong method ${wrong} on ${route.path} → 405`, async () => {
        const requestPath = route.request_path || route.path;
        const response = await fetch(`${BASE_URL}${requestPath}`, { method: wrong });
        expect(response.status).toBe(405);
      });
    }
  });
});
