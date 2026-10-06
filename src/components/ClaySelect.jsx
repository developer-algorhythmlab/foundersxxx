import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Custom dropdown with a clay-styled, scrollable option list (native <select> menus can't be themed).
export default function ClaySelect({ value, onChange, options, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function openList() {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  }

  function pick(opt) {
    onChange(opt);
    setOpen(false);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      setActive((i) => Math.min(options.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1))));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open ? pick(options[active]) : openList();
    }
  }

  return (
    <div className="clay-select" ref={wrapRef}>
      <button
        type="button"
        className="clay-select-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span>{value}</span>
        <ChevronDown size={16} className="clay-select-chev" />
      </button>
      {open && (
        <ul className="clay-select-list" role="listbox" ref={listRef}>
          {options.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={opt === value}
              className={`clay-select-opt${i === active ? " is-active" : ""}${opt === value ? " is-selected" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(opt)}
            >
              <span>{opt}</span>
              {opt === value && <Check size={15} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
