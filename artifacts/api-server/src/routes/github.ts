import { Router, type IRouter, type Request, type Response } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const GITHUB_REPO = process.env["GITHUB_REPO"] ?? "dainraku-os/dainraku";
const GITHUB_TOKEN = process.env["GITHUB_TOKEN"] ?? "";
const WORKFLOW_FILE = "build-iso.yml";

function ghHeaders() {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
  };
}

function ghFetch(path: string, options?: RequestInit) {
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      ...ghHeaders(),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });
}

/**
 * POST /api/github/trigger-build
 * Body: { packages?: string[], version?: string, prerelease?: boolean }
 *
 * Triggers a workflow_dispatch on the build-iso.yml workflow and returns
 * the newly created run's ID so the client can poll for status.
 */
router.post("/github/trigger-build", async (req: Request, res: Response) => {
  if (!GITHUB_TOKEN) {
    res.status(503).json({
      error: "GITHUB_TOKEN is not configured on the server. Ask the owner to add it as a secret.",
    });
    return;
  }

  const {
    packages = [],
    version = "v1.0.0-dev",
    prerelease = true,
  } = req.body as {
    packages?: string[];
    version?: string;
    prerelease?: boolean;
  };

  const triggeredAt = new Date().toISOString();

  // Dispatch the workflow
  const dispatchRes = await ghFetch(
    `/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ref: "main",
        inputs: {
          version,
          prerelease: String(prerelease),
          packages: JSON.stringify(packages),
        },
      }),
    },
  );

  if (!dispatchRes.ok) {
    const text = await dispatchRes.text();
    logger.error({ status: dispatchRes.status, body: text }, "GitHub dispatch failed");
    res.status(dispatchRes.status).json({
      error: `GitHub API error ${dispatchRes.status}: ${text}`,
    });
    return;
  }

  // GitHub takes a moment to create the run after dispatch; wait briefly
  await new Promise((r) => setTimeout(r, 3000));

  // Find the run that was just created (created >= triggeredAt)
  const runsRes = await ghFetch(
    `/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/runs?event=workflow_dispatch&per_page=5`,
  );

  if (!runsRes.ok) {
    // Dispatch succeeded but we couldn't retrieve the run ID yet — caller can poll /runs/latest
    res.json({ triggered: true, runId: null, triggeredAt });
    return;
  }

  const runsData = (await runsRes.json()) as {
    workflow_runs: Array<{ id: number; created_at: string; status: string }>;
  };

  // Pick the newest run created on or after the dispatch
  const newRun = runsData.workflow_runs.find(
    (r) => new Date(r.created_at) >= new Date(triggeredAt),
  ) ?? runsData.workflow_runs[0];

  res.json({
    triggered: true,
    runId: newRun?.id ?? null,
    triggeredAt,
  });
});

/**
 * GET /api/github/runs/:runId
 * Returns the status, conclusion, and (if complete) a release URL for a run.
 */
router.get("/github/runs/:runId", async (req: Request, res: Response) => {
  if (!GITHUB_TOKEN) {
    res.status(503).json({ error: "GITHUB_TOKEN is not configured on the server." });
    return;
  }

  const { runId } = req.params;

  const runRes = await ghFetch(`/repos/${GITHUB_REPO}/actions/runs/${runId}`);

  if (!runRes.ok) {
    res.status(runRes.status).json({ error: `GitHub API error ${runRes.status}` });
    return;
  }

  const run = (await runRes.json()) as {
    id: number;
    status: string;
    conclusion: string | null;
    html_url: string;
    created_at: string;
    updated_at: string;
    head_sha: string;
  };

  // If the run completed successfully, try to find the matching release
  let releaseUrl: string | null = null;
  if (run.status === "completed" && run.conclusion === "success") {
    const releasesRes = await ghFetch(
      `/repos/${GITHUB_REPO}/releases?per_page=5`,
    );
    if (releasesRes.ok) {
      const releases = (await releasesRes.json()) as Array<{
        html_url: string;
        created_at: string;
        assets: Array<{ name: string; browser_download_url: string; size: number }>;
      }>;
      // Find a release created around the same time as the run's last update
      const runUpdated = new Date(run.updated_at).getTime();
      const recent = releases.find(
        (rel) => Math.abs(new Date(rel.created_at).getTime() - runUpdated) < 30 * 60 * 1000,
      ) ?? releases[0];
      if (recent) {
        releaseUrl = recent.html_url;
      }
    }
  }

  res.json({
    id: run.id,
    status: run.status,       // queued | in_progress | completed
    conclusion: run.conclusion, // success | failure | cancelled | null
    htmlUrl: run.html_url,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    releaseUrl,
  });
});

/**
 * GET /api/github/config
 * Returns the configured repo so the frontend can show the right links.
 */
router.get("/github/config", (_req: Request, res: Response) => {
  res.json({
    repo: GITHUB_REPO,
    hasToken: Boolean(GITHUB_TOKEN),
  });
});

export default router;
