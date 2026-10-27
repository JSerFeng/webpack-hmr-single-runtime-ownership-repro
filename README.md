# A module loses future HMR updates while its old chunk stays in the same runtime

Standalone reproduction with **unmodified webpack 5.112.2**, Node.js 22 or newer. No Rspack patches, runtime monkey-patching, dev server, framework, or browser reload fallback.

## Run

```sh
npm ci
npm test
npm run test:control
```

`npm test` asserts the desired behavior and is expected to **exit 1 on the affected version**. The control is expected to exit 0. Each invocation recreates only the gitignored `.work/` directory; tracked source files are unchanged.

## Scenario

Initially dep and keeper are both installed in shared, in one runtime. Replace the synchronous dep import with an uncalled dynamic import. Keeper leaves shared installed in that same runtime, while dep moves to the unloaded moved chunk. Then edit dep from 2 to 3 and apply HMR. Finally invoke the dynamic import.

The starting files are in [src](src); [steps](steps) contains the exact edits. [reproduce.cjs](reproduce.cjs) performs those edits and applies HMR. The small [harness](harness.cjs) uses webpack's public Node API, persisting compilation records between successive builds, then executes webpack's real emitted runtime.

## Actual and expected behavior

The second HMR operation completes with no dep update. The first invocation of the new import still returns cached value 2 instead of 3. This does not require multi-runtime output or removal of the old chunk. It is outside the removed-chunk branch handled by webpack PR #21131.

The assertions express the expected result. See [observed.json](observed.json) for the captured failing run and [control.json](control.json) for its successful control. Generated chunks and update files are left in `.work/dist/`; each run also writes `results/last-run.json` with the compilation hashes, chunk/module membership, manifests, and result.

## Control

Invoke the new dynamic import immediately after the move, before editing dep. That gives the runtime an installed owning chunk, and the later update succeeds.

## Scope

Verified on 2026-10-28. HMR compiler and JavaScript HMR runtime files in the npm release match webpack main commit `bd8eddff945733f65ada91ad441ce8b613f1544a` byte-for-byte. This is **not** a claim that every file or target on main was tested.

Related: [webpack #21131](https://github.com/webpack/webpack/pull/21131). This case deliberately keeps the old chunk in the same runtime; `manifest.r` stays empty, and the force-load path does not cover the move.
