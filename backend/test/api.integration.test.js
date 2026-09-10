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

function authHeaders(route) {
  if (!route.auth_required) return {};
  const token = process.env.TEST_AUTH_TOKEN || "test-token";
  return { Authorization: `Bearer ${token}` };
}

describe("API integration contracts", () => {
  for (const route of ROUTES) {
    it(`${route.method} ${route.path} should return ${route.success_status}`, async () => {
      const hasBody = route.sample_body && typeof route.sample_body === "object" && !Array.isArray(route.sample_body);
            const requestPath = route.request_path || route.path;
            const response = await fetch(`${BASE_URL}${requestPath}`, {
        method: route.method,
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(route),
        },
        body: hasBody ? JSON.stringify(route.sample_body) : undefined,
      });

      expect(response.status).toBe(route.success_status);

      if (route.expects_json) {
        const body = await response.json();
        if (Array.isArray(route.response_keys) && route.response_keys.length && body && !Array.isArray(body)) {
          for (const key of route.response_keys) {
            expect(body).toHaveProperty(key);
          }
        }
      }
    });
  }
});
