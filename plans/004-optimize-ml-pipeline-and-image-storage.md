# Plan 004: Optimize ML Inference Pipeline and Restrict Medical Image Storage

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1968e3d..HEAD -- index.py src/lib/actions.ts next.config.js`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-fix-verification-baseline.md
- **Category**: perf
- **Planned at**: commit `1968e3d`, 2026-09-12
- **Issue**: https://github.com/joaquinvaldezzz/capstone/issues/18

## Why this matters

The Python Flask inference service (`index.py`) currently reloads the 17.3MB Keras model from disk on every incoming POST request, runs three redundant inference passes for the same image, and flips labels with a random coin-flip generator. Furthermore, ultrasound images uploaded to Vercel Blob are configured with `access: 'public'` and `addRandomSuffix: false`, meaning any duplicate image filename overwrites an existing patient's diagnostic ultrasound scan in cloud storage.

## Current state

The relevant files:

- `index.py:147` reloads `model = load_model('MobileNetModelPCOS.h5')` inside `upload()`, despite already having loaded `model` globally at line 19.
- `index.py:149, 155, 165` executes three separate inference passes on the uploaded image (`model.predict(img_array)`, `get_result(file_path)`, and `grad_model(img_array)`).
- `index.py:188` computes fake ground truth with `get_randomized_true_label(predicted_label)`.
- `index.py:204` executes `app.run(debug=True)`.
- `src/lib/actions.ts:172-179` stores ultrasound images with `access: 'public'` and `addRandomSuffix: false`.
- `next.config.js:7-14` restricts `remotePatterns` to `pathname: '/ultrasound-images/**'`, causing avatar images under `/profile-pictures/**` to fail Next.js optimization.

Exemplar excerpts:

`index.py:146-159`:

```python
model = load_model('MobileNetModelPCOS.h5')

predictions = model.predict(img_array)
predicted_class = np.argmax(predictions)
class_names = ['Healthy', 'Infected']
predicted_class_name = class_names[predicted_class]
confidence_level = np.max(predictions)

predictions = get_result(file_path)
predicted_label = labels[np.argmax(predictions)]
confidence = np.max(predictions)
label = f'{confidence * 100:.2f}%'
```

`src/lib/actions.ts:171-179`:

```typescript
// Upload the ultrasound image to the server
await put(
  `ultrasound-images/${String(parsedData.data.ultrasound_image.name)}`,
  parsedData.data.ultrasound_image,
  {
    access: 'public',
    addRandomSuffix: false,
  },
)
```

## Commands you will need

| Purpose      | Command                          | Expected on success  |
| ------------ | -------------------------------- | -------------------- |
| Next Lint    | `bun run lint`                   | exit 0, no errors    |
| Typecheck    | `bun x tsc --noEmit`             | exit 0, no errors    |
| Python check | `python3 -m py_compile index.py` | exit 0, syntax valid |

## Scope

**In scope**:

- `index.py`
- `src/lib/actions.ts`
- `next.config.js`

**Out of scope**:

- Do NOT rewrite database schemas for diagnostic results (covered in Plan 005).
- Do NOT change the model weights or training files.

## Git workflow

- Branch: `advisor/004-optimize-ml-pipeline-and-image-storage`
- Commit style: Conventional Commits, e.g. `perf(ml): eliminate redundant model reloads and sanitize blob uploads`
- Do NOT push or open a PR unless instructed by the operator.

## Steps

### Step 1: Eliminate redundant model reloads and consolidate inference in `index.py`

1. In `index.py`, remove line 147 (`model = load_model('MobileNetModelPCOS.h5')`).
2. Remove redundant call to `get_result(file_path)`. Use the output from the initial forward pass `predictions` to compute `predicted_label` and `label`.
3. Pre-build `grad_model` once at module level rather than rebuilding `tf.keras.models.Model(...)` on every request.
4. Ensure `uploads/` directory exists before saving: `os.makedirs(os.path.join(base_path, 'uploads'), exist_ok=True)`.
5. Clean up uploaded temporary files in a `finally:` block so disk space does not leak.
6. Guard against empty filename: check `if not f.filename: return {'error': 'No file provided'}, 400`.
7. Remove the fake random generator `get_randomized_true_label` from the live inference endpoint.
8. Disable `debug=True` in `app.run(debug=os.getenv('FLASK_DEBUG', 'False').lower() == 'true')`.

**Verify**: `python3 -m py_compile index.py` exits 0.

### Step 2: Sanitize image keys and prevent overwrites in Vercel Blob

In `src/lib/actions.ts:171-179`:

1. Update `put(...)` call in `addPatient` to enable `addRandomSuffix: true` (or generate a unique UUID prefix: `${crypto.randomUUID()}-${parsedData.data.ultrasound_image.name}`).
2. Store the returned Blob `url` or sanitized key in the `results` table rather than the raw unsuffixed client filename.

**Verify**: `bun x tsc --noEmit` exits 0.

### Step 3: Expand Next.js remotePatterns for all storage paths

In `next.config.js`:
Update `images.remotePatterns` to allow all paths from the Vercel storage host:

```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: '**.vercel-storage.com',
    port: '',
    pathname: '/**',
  },
],
```

**Verify**: `bun run build` exits 0.

## Test plan

- Test uploading an ultrasound image through `addPatient` &rarr; verifies file is stored with unique suffixed key, preventing collisions.
- Test `/api/predict` in Flask &rarr; returns diagnosis and Grad-CAM in a single pass without reloading the H5 model.
- Test avatar rendering &rarr; Next.js `<Image>` loads from `/profile-pictures/**` without `remotePatterns` configuration error.

## Done criteria

- [ ] `index.py` loads `MobileNetModelPCOS.h5` exactly once at module startup
- [ ] No multiple inference passes per request in Flask
- [ ] `addRandomSuffix: true` enabled on Vercel Blob uploads
- [ ] `next.config.js` allows all blob image paths
- [ ] `plans/README.md` status updated to DONE

## STOP conditions

- If TensorFlow or Keras versions fail to instantiate `grad_model` at module level, maintain the single global model and create the grad computation inside the handler without reloading the H5 file from disk.

## Maintenance notes

- In production environments, run `index.py` via a WSGI server (such as Gunicorn or Uvicorn) instead of `app.run()`.
