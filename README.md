# solvia_codex-version

## Current source of truth

- **`index.html` is the current canonical app shell and runtime entry point.**
- New UI/runtime changes should be implemented in `index.html` first.

## Reference files (not active runtime source right now)

- `script.js`
- `style.css`

These files are currently maintained as **reference / legacy candidates** and may contain useful logic/styles from prior iterations.

## Why this rule exists

- Avoid split ownership and conflicting behavior across multiple runtime paths.
- Keep one clear source of truth while the app shell is still being stabilized.
- Reduce regression risk during iterative UI shell changes.

## Next migration principle

After the shell stabilizes, move only **reusable, proven logic/styles** from reference files into a cleaner structure in small, controlled steps.
