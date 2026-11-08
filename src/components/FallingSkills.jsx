import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const skills = [
  "Software Engineering",
  "Python",
  "React",
  "Databases",
  "API Design",
  "Agentic Orchestration",
];

const { Bodies, Body, Composite, Constraint, Engine, Sleeping } = Matter;

export function FallingSkills({ motion }) {
  const stage = useRef(null);
  const simulation = useRef(null);
  const hasDropped = useRef(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const active = motion && !reduced;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(preference.matches);
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (!active) return;
    const element = stage.current;
    const pills = [...element.querySelectorAll(".skill-pill")];
    let disposeWorld = () => {};
    let lastWidth = 0;

    const setup = () => {
      const width = element.clientWidth;
      if (!width || Math.abs(width - lastWidth) < 1) return;
      lastWidth = width;
      disposeWorld();
      const height = element.clientHeight;
      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1.15;
      const drop = !hasDropped.current;
      let frame = 0;
      let previous = 0;
      let dragging = null;
      let visible = true;
      let disposed = false;
      const bodies = pills.map((pill, index) => {
        const w = pill.offsetWidth;
        const h = pill.offsetHeight;
        const x = Math.max(
          w / 2 + 4,
          Math.min(
            width - w / 2 - 4,
            width * [0.2, 0.64, 0.85, 0.43, 0.72, 0.3][index],
          ),
        );
        return Bodies.rectangle(
          x,
          drop ? -50 - index * 65 : height - 30 - Math.floor(index / 2) * 52,
          w,
          h,
          {
            chamfer: { radius: h / 2 - 2 },
            restitution: 0.32,
            friction: 0.65,
            frictionAir: 0.018,
            angle: (index % 2 ? 1 : -1) * 0.09,
            sleepThreshold: 65,
          },
        );
      });
      Composite.add(engine.world, [
        ...bodies,
        Bodies.rectangle(width / 2, height + 24, width + 120, 60, {
          isStatic: true,
        }),
        Bodies.rectangle(-30, height / 2 - 300, 60, height + 1000, {
          isStatic: true,
        }),
        Bodies.rectangle(width + 30, height / 2 - 300, 60, height + 1000, {
          isStatic: true,
        }),
        Bodies.rectangle(width / 2, -550, width + 120, 60, { isStatic: true }),
      ]);

      const paint = () => {
        bodies.forEach((body, index) => {
          const pill = pills[index];
          pill.style.transform = `translate(${body.position.x - pill.offsetWidth / 2}px, ${body.position.y - pill.offsetHeight / 2}px) rotate(${body.angle}rad)`;
        });
      };
      const step = (delta) => {
        Engine.update(engine, delta);
        bodies.forEach((body) => {
          // Keep the labels readable after a collision or toss.
          if (Math.abs(body.angle) > 0.28) {
            Body.setAngle(body, Math.sign(body.angle) * 0.28);
            Body.setAngularVelocity(body, 0);
          }
        });
      };
      const tick = (now) => {
        frame = 0;
        if (disposed || !visible || document.hidden) return;
        const elapsed = previous ? Math.min(now - previous, 33.33) : 16.67;
        hasDropped.current = true;
        previous = now;
        // Small fixed steps keep collisions stable on slower phones.
        const steps = Math.max(1, Math.ceil(elapsed / 16.67));
        for (let i = 0; i < steps; i++) step(elapsed / steps);
        paint();
        if (dragging || bodies.some((body) => !body.isSleeping))
          frame = requestAnimationFrame(tick);
      };
      const wake = () => {
        previous = 0;
        if (!frame && !disposed && visible && !document.hidden)
          frame = requestAnimationFrame(tick);
      };
      const release = (event) => {
        if (
          !dragging ||
          (event?.pointerId !== undefined &&
            event.pointerId !== dragging.pointerId)
        )
          return;
        const released = dragging;
        dragging = null;
        Composite.remove(engine.world, released.constraint);
        released.pill.removeAttribute("data-dragging");
        if (released.pill.hasPointerCapture(released.pointerId))
          released.pill.releasePointerCapture(released.pointerId);
        wake();
      };
      const point = (event) => {
        const bounds = element.getBoundingClientRect();
        return {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        };
      };
      const down = (event) => {
        if (event.button !== 0 || dragging) return;
        const pill = event.target.closest(".skill-pill");
        if (!pill) return;
        const body = bodies[pills.indexOf(pill)];
        const position = point(event);
        const constraint = Constraint.create({
          pointA: position,
          bodyB: body,
          pointB: { x: 0, y: 0 },
          stiffness: 0.15,
          damping: 0.12,
          length: 0,
        });
        Sleeping.set(body, false);
        Composite.add(engine.world, constraint);
        dragging = { pill, constraint, pointerId: event.pointerId };
        pill.dataset.dragging = "true";
        pill.setPointerCapture(event.pointerId);
        wake();
      };
      const move = (event) => {
        if (!dragging || event.pointerId !== dragging.pointerId) return;
        const position = point(event);
        dragging.constraint.pointA = {
          x: Math.max(10, Math.min(width - 10, position.x)),
          y: Math.max(10, Math.min(height - 15, position.y)),
        };
        wake();
      };
      const toss = (index) => {
        const body = bodies[index];
        Sleeping.set(body, false);
        Body.setVelocity(body, { x: index % 2 ? 2 : -2, y: -15 });
        Body.setAngularVelocity(body, index % 2 ? 0.025 : -0.025);
        wake();
      };
      const keyboard = (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const index = pills.indexOf(event.target);
        if (index < 0) return;
        event.preventDefault();
        toss(index);
      };
      simulation.current = {
        toss,
        drop() {
          release();
          bodies.forEach((body, i) => {
            Body.setPosition(body, {
              x: Math.max(
                pills[i].offsetWidth / 2 + 4,
                Math.min(
                  width - pills[i].offsetWidth / 2 - 4,
                  (width * (i + 1)) / (bodies.length + 1),
                ),
              ),
              y: -50 - i * 65,
            });
            Body.setVelocity(body, { x: 0, y: 0 });
            Body.setAngularVelocity(body, 0);
            Sleeping.set(body, false);
          });
          wake();
        },
      };
      element.dataset.physics = "ready";
      paint();
      if (!drop) {
        for (let i = 0; i < 240; i++) step(1000 / 60);
        paint();
      }
      element.addEventListener("pointerdown", down);
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerup", release);
      element.addEventListener("pointercancel", release);
      element.addEventListener("lostpointercapture", release);
      element.addEventListener("keydown", keyboard);
      const visibility = () => {
        if (document.hidden) release();
        else wake();
      };
      document.addEventListener("visibilitychange", visibility);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
        else release();
      });
      observer.observe(element);
      wake();
      disposeWorld = () => {
        disposed = true;
        release();
        cancelAnimationFrame(frame);
        observer.disconnect();
        document.removeEventListener("visibilitychange", visibility);
        element.removeEventListener("pointerdown", down);
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerup", release);
        element.removeEventListener("pointercancel", release);
        element.removeEventListener("lostpointercapture", release);
        element.removeEventListener("keydown", keyboard);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        delete element.dataset.physics;
        pills.forEach((pill) => pill.style.removeProperty("transform"));
        simulation.current = null;
      };
    };
    const resize = new ResizeObserver(setup);
    resize.observe(element);
    setup();
    return () => {
      resize.disconnect();
      disposeWorld();
    };
  }, [active]);

  return (
    <div className="skills-playground">
      <div className="skills-caption">
        <span>
          <i aria-hidden="true" /> A FEW THINGS I WORK WITH
        </span>
        {active && (
          <button type="button" onClick={() => simulation.current?.drop()}>
            Drop again <span aria-hidden="true">↘</span>
          </button>
        )}
      </div>
      <div ref={stage} className="skills-stage" aria-label="My skills">
        {skills.map((skill, index) => (
          <button
            type="button"
            className={`skill-pill skill-pill-${index}`}
            key={skill}
            disabled={!active}
            onClick={(event) => {
              if (event.detail === 0) simulation.current?.toss(index);
            }}
            aria-label={
              active ? `${skill}. Drag to move, or press Enter to toss.` : skill
            }
          >
            <span aria-hidden="true">
              {index === 0 ? "✳" : index === 5 ? "↗" : ""}
            </span>
            {skill}
          </button>
        ))}
      </div>
      <p className="sr-only">
        {active
          ? "Drag the skills to play. On a keyboard, focus a skill and press Enter or Space to toss it."
          : "Animation is off. Skills are displayed without movement."}
      </p>
    </div>
  );
}
