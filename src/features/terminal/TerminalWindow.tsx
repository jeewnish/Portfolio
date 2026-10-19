import React, { useEffect, useRef, useState } from "react";
import { executeTerminalCommand, type TerminalOutputItem } from "./terminalCommands";
import { assetUrl } from "../../data/apps";
import "./terminal.css";

interface TerminalHistoryEntry {
  id: string;
  command: string;
  outputs: TerminalOutputItem[];
}

interface TerminalWindowProps {
  onOpenProject?: (projectId?: string) => void;
}

export default function TerminalWindow({ onOpenProject }: TerminalWindowProps) {
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Focus input automatically on mount and keep terminal alive
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to the bottom whenever output updates
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Up arrow: Navigate backwards through command history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeCurrentCommand();
    }
  };

  const executeCurrentCommand = () => {
    const raw = inputVal;
    const trimmed = raw.trim();

    if (!trimmed) {
      if (raw.length > 0 || history.length >= 0) {
        // Blank enter press
        setHistory(prev => [
          ...prev,
          { id: crypto.randomUUID(), command: "", outputs: [] }
        ]);
      }
      setInputVal("");
      return;
    }

    // Save to command history for arrow-key navigation
    setCmdHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const { output, clearScreen } = executeTerminalCommand(trimmed, {
      openProjectWindow: onOpenProject
    });

    if (clearScreen) {
      setHistory([]);
      setInputVal("");
      return;
    }

    setHistory(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        command: trimmed,
        outputs: output
      }
    ]);
    setInputVal("");
  };

  // Click anywhere in terminal focuses the prompt
  const handleTerminalClick = (e: React.MouseEvent) => {
    // Don't steal focus if clicking an anchor link
    if ((e.target as HTMLElement).tagName.toLowerCase() === "a") {
      return;
    }
    inputRef.current?.focus();
  };

  return (
    <div className="terminal-wrapper" onClick={handleTerminalClick}>
      <div className="terminal-scroll-area" ref={scrollAreaRef}>
        <div className="terminal-welcome">
          <div className="terminal-welcome-title">Welcome to Sloth-OS Simulated Terminal v1.0</div>
          <div className="terminal-welcome-desc">
            Type <span className="terminal-badge">help</span> to view available commands, or explore
            portfolio data using <span className="terminal-badge">about</span>,{" "}
            <span className="terminal-badge">skills</span>,{" "}
            <span className="terminal-badge">projects</span>, and{" "}
            <span className="terminal-badge">contact</span>.
          </div>
          <div className="terminal-hints">
            * All data is synchronized directly from the portfolio content layer.
          </div>
        </div>

        {history.map(entry => (
          <div key={entry.id} className="terminal-history-item">
            <div className="terminal-prompt-line">
              <span className="terminal-prompt-user">visitor@sloth-os</span>
              <span className="terminal-prompt-symbol">:</span>
              <span className="terminal-prompt-path">~</span>
              <span className="terminal-prompt-symbol">$</span>
              <span className="terminal-executed-cmd">{entry.command}</span>
            </div>

            {entry.outputs.map(out => (
              <div key={out.id} className={`terminal-output-block type-${out.type}`}>
                {out.text && <div className="terminal-output-line">{out.text}</div>}
                {out.lines &&
                  out.lines.map((line, idx) => (
                    <div key={idx} className="terminal-output-line">
                      {line || "\u00A0"}
                    </div>
                  ))}
                {out.links && out.links.length > 0 && (
                  <div className="terminal-links">
                    {out.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="terminal-link-btn"
                        onClick={e => e.stopPropagation()}
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <img
        className="terminal-sloth-mascot"
        src={assetUrl("angry_sloth.webp")}
        alt=""
        draggable={false}
      />

      <div className="terminal-input-container">
        <div className="terminal-prompt-line" style={{ margin: 0 }}>
          <span className="terminal-prompt-user">visitor@sloth-os</span>
          <span className="terminal-prompt-symbol">:</span>
          <span className="terminal-prompt-path">~</span>
          <span className="terminal-prompt-symbol">$</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input-field"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Terminal input command"
        />
      </div>
    </div>
  );
}
