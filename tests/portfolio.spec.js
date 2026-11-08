import { test, expect } from "@playwright/test";

async function openCompiler(page) {
  await page
    .getByRole("button", { name: "Read Compiler case study", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Compile", exact: true }),
  ).toBeEnabled({ timeout: 45000 });
}

async function compile(page) {
  await page.getByRole("button", { name: "Compile", exact: true }).click();
  await expect(page.locator(".diagnostic-label")).toBeVisible();
}

test("skills fall, remain readable, support interaction, and honor reduced motion", async ({
  page,
  isMobile,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "OSCAR MENDIVIL",
  );
  await expect(page.locator(".skill-pill")).toHaveCount(6);
  await expect(page.locator(".skills-stage")).toHaveAttribute(
    "data-physics",
    "ready",
  );
  await expect
    .poll(
      async () =>
        page.locator(".skills-stage").evaluate((stage) => {
          const bounds = stage.getBoundingClientRect();
          return [...stage.children].every((pill) => {
            const rect = pill.getBoundingClientRect();
            return (
              rect.top >= bounds.top - 3 &&
              rect.bottom <= bounds.bottom + 3 &&
              rect.left >= bounds.left - 3 &&
              rect.right <= bounds.right + 3
            );
          });
        }),
      { timeout: 12000 },
    )
    .toBe(true);
  const pill = page.locator(".skill-pill").filter({ hasText: "Python" });
  const start = await pill.boundingBox();
  if (!isMobile) {
    await page.mouse.move(
      start.x + start.width / 2,
      start.y + start.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(start.x + start.width / 2 - 70, start.y - 65, {
      steps: 15,
    });
    await expect(pill).toHaveAttribute("data-dragging", "true");
    await page.mouse.up();
    await expect(pill).not.toHaveAttribute("data-dragging", "true");
  } else {
    // Horizontal touch gestures move a pill; vertical gestures remain available
    // to the browser for normal page scrolling through touch-action: pan-y.
    const touch = await page.context().newCDPSession(page);
    const position = {
      x: start.x + start.width / 2,
      y: start.y + start.height / 2,
    };
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [position],
    });
    await expect(pill).toHaveAttribute("data-dragging", "true");
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: position.x - 40, y: position.y - 5 }],
    });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(pill).not.toHaveAttribute("data-dragging", "true");
    await touch.detach();
  }
  await pill.focus();
  await pill.press("Enter");
  await expect
    .poll(async () => (await pill.boundingBox()).y)
    .toBeLessThan(start.y - 10);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".skills-stage")).not.toHaveAttribute(
    "data-physics",
    "ready",
  );
  await expect(pill).toBeDisabled();
  await expect(page.getByRole("button", { name: "Drop again" })).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});

test("original Python compiler analyzes editable code and exposes tokens and the syntax tree", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const runtimeRequests = [];
  const errors = [];
  page.on("request", (request) => {
    if (request.url().includes("/runtime/python/"))
      runtimeRequests.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator(".project")).toHaveCount(4);
  expect(runtimeRequests).toHaveLength(0);
  await openCompiler(page);
  expect(runtimeRequests.some((url) => url.endsWith(".wasm"))).toBe(true);
  await compile(page);
  await expect(page.locator(".diagnostic-label")).toHaveText(
    "All checks passed",
  );
  await expect(
    page.locator('.compiler-stages li[data-status="passed"]'),
  ).toHaveCount(3);
  await page.getByRole("tab", { name: "Tokens", exact: true }).click();
  await expect(page.getByRole("table")).toContainText("twice");
  await page.getByRole("tab", { name: "Syntax tree", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText('"node": "Program"');
  await expect(page.getByRole("tabpanel")).toContainText("FuncDecl");
  await page
    .getByLabel("Source code", { exact: true })
    .fill("int answer = 42;");
  await expect(page.locator(".diagnostic-label")).toHaveCount(0);
  await compile(page);
  await expect(page.locator(".diagnostic-label")).toHaveText(
    "All checks passed",
  );
  await expect(page.locator(".diagnostic-success")).toContainText("5 tokens");
  await page.getByLabel("Source code", { exact: true }).fill(" ");
  await expect(
    page.getByRole("button", { name: "Compile", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Reset code" }).click();
  await expect(page.getByLabel("Source code", { exact: true })).toContainText(
    "twice",
  );
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Read Compiler case study", exact: true }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});

test("compiler reports lexical, syntax, type, and scope errors and recovers with fresh state", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await openCompiler(page);
  await page.getByLabel("Start with").selectOption("syntax");
  await compile(page);
  await expect(page.locator(".diagnostic-errors")).toContainText(
    "Expected ';'",
  );
  await expect(
    page.locator('.compiler-stages li[data-status="passed"]'),
  ).toHaveCount(1);
  await page.getByLabel("Start with").selectOption("types");
  await compile(page);
  await expect(page.locator(".diagnostic-label")).toHaveText("2 issues found");
  await expect(page.locator(".diagnostic-errors")).toContainText("bool");
  await page.getByLabel("Start with").selectOption("scope");
  await compile(page);
  await expect(page.locator(".diagnostic-errors")).toContainText("missing");
  await expect(page.locator(".diagnostic-errors")).toContainText("argument");
  await page.getByLabel("Source code", { exact: true }).fill("int x = @;");
  await compile(page);
  await expect(page.locator(".diagnostic-errors")).toContainText(
    "Unexpected character",
  );
  await expect(
    page.locator('.compiler-stages li[data-status="passed"]'),
  ).toHaveCount(0);
  await page.getByLabel("Start with").selectOption("valid");
  await compile(page);
  await expect(page.locator(".diagnostic-label")).toHaveText(
    "All checks passed",
  );
});

test("runtime loading failure can be retried and closing the demo releases its worker", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/runtime/python/**/pyodide.mjs", (route) =>
    route.abort(),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Read Compiler case study", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Retry loading" }),
  ).toBeVisible();
  await page.unroute("**/runtime/python/**/pyodide.mjs");
  await page.getByRole("button", { name: "Retry loading" }).click();
  await expect(
    page.getByRole("button", { name: "Compile", exact: true }),
  ).toBeEnabled({ timeout: 45000 });
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await openCompiler(page);
  await compile(page);
  await expect(page.locator(".diagnostic-label")).toHaveText(
    "All checks passed",
  );
});

test("project filters stay unique and existing portrait and SPL interactions still work", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero-photo")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Life outside the screen Piano, coffee & a little play.",
    })
    .click();
  await expect(page.locator(".hero-note-detail")).toContainText(
    "A few things that feel like me.",
  );
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: 768, height: 1000 });
  const portrait = await page.locator(".hero-photo").boundingBox();
  const notes = await page.locator(".hero-note-links").boundingBox();
  const detail = await page.locator(".hero-note-detail").boundingBox();
  expect(notes.y).toBeGreaterThanOrEqual(portrait.y + portrait.height);
  expect(detail.y).toBeGreaterThanOrEqual(notes.y + notes.height);
  await page.setViewportSize(viewport);
  await expect(
    page.getByRole("button", { name: "Product engineering", exact: true }),
  ).toHaveCount(1);
  await page
    .getByRole("button", { name: "Product engineering", exact: true })
    .click();
  await expect(page.locator(".project")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Read SPL ERP case study", exact: true })
    .click();
  await page.getByRole("button", { name: "Next SPL screenshot" }).click();
  await expect(page.locator(".spl-gallery figcaption")).toContainText(
    "Event management",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", { name: "AI architecture", exact: true })
    .click();
  await expect(page.locator(".project")).toHaveCount(1);
  await page.getByRole("button", { name: "All work", exact: true }).click();
  await expect(page.locator(".project")).toHaveCount(4);
});
