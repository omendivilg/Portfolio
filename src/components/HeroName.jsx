import { useLayoutEffect, useRef } from "react";

export function HeroName() {
  const heading = useRef(null);

  useLayoutEffect(() => {
    const element = heading.current;
    const words = [...element.querySelectorAll(".headline-line > span")];
    let disposed = false;
    let lastWidth = 0;

    const fit = () => {
      if (disposed || !element.clientWidth) return;
      const style = getComputedStyle(element);
      const widths = words.map((word) => word.getBoundingClientRect().width);
      const naturalWidth =
        style.display === "block"
          ? Math.max(...widths)
          : widths.reduce((total, width) => total + width, 0) +
            parseFloat(style.columnGap);
      if (!naturalWidth) return;
      const size =
        (parseFloat(style.fontSize) * (element.clientWidth - 1)) / naturalWidth;
      element.style.fontSize = `${Math.floor(size * 100) / 100}px`;
      lastWidth = element.clientWidth;
    };

    fit();
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== lastWidth) fit();
    });
    observer.observe(element.parentElement);
    // Refit with the real font metrics, including fonts loaded after first paint.
    document.fonts.ready.then(fit);
    document.fonts.addEventListener("loadingdone", fit);
    return () => {
      disposed = true;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", fit);
    };
  }, []);

  return (
    <h1 id="hero-heading" ref={heading}>
      <span className="headline-line">
        <span>OSCAR</span>
      </span>{" "}
      <span className="headline-line">
        <span>MENDIVIL</span>
      </span>
    </h1>
  );
}
