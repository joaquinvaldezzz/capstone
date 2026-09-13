# Plan 006: Surface ML Explainability (Grad-CAM Visual Heatmaps) in Diagnostic Workflows

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 1fa458b..HEAD -- index.py src/lib/db-schema.ts src/lib/actions.ts src/lib/dal.ts src/app/doctor/results/[id]/page.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans/004-optimize-ml-pipeline-and-image-storage.md, plans/005-parameterize-dal-and-tenant-scoping.md
- **Category**: direction
- **Planned at**: commit `1fa458b`, 2026-09-13
- **Issue**: None

## Why this matters

Deep learning models for medical ultrasound analysis must not operate as opaque black boxes. When predicting Polycystic Ovary Syndrome (PCOS), clinicians need visual confirmation of the regions of interest (e.g. peripheral follicles/cysts versus ultrasound calipers or imaging artifacts) that drove the classification.

Currently, `index.py` already computes a Grad-CAM activation heatmap using `grad_model` and superimposes it onto the ultrasound image, but `upload()` discards the resulting image and only returns `{ 'percentage': label, 'result': predicted_label }`. The generated heatmap is immediately deleted in a `finally` block. This plan modifies the Flask API to return the Grad-CAM image (as base64), uploads it alongside the raw ultrasound to Vercel Blob storage, stores `gradcam_image` in the `results` table, and adds an interactive comparison viewer on the doctor's result page.

## Current state

The relevant files:

- `index.py:156-186` — Computes Grad-CAM heatmap with `jet` colormap, superimposes on `img_array[0]`, saves to `file_path`, but returns only `{ 'percentage': label, 'result': predicted_label }` and deletes the image in `finally`.
- `src/lib/db-schema.ts:64-76` — `results` table schema lacks a column for storing the Grad-CAM image filename.
- `src/lib/actions.ts:145-183` — `addPatient` receives the Flask JSON response, uploads only the raw `ultrasound_image` to Vercel Blob, and commits `results`.
- `src/lib/dal.ts:13-27, 190-208, 239-270` — `Result` and `PatientResult` interfaces and SQL queries select only `ultrasound_image`.
- `src/app/doctor/results/[id]/page.tsx:117-133` — Displays only the raw grayscale ultrasound image without any explainability visualization.

Exemplar excerpts:

`index.py:156-186`:

```python
# Grad-CAM integration
with tf.GradientTape() as tape:
    last_conv_layer_output, preds = grad_model(img_array)
    top_pred_index = tf.argmax(preds[0])
    top_class_channel = preds[:, top_pred_index]

grads = tape.gradient(top_class_channel, last_conv_layer_output)
pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
last_conv_layer_output = last_conv_layer_output[0]
heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
heatmap = tf.squeeze(heatmap)
heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
heatmap = tf.expand_dims(heatmap, -1)
heatmap = tf.image.resize(heatmap, (224, 224))
heatmap = tf.squeeze(heatmap)
heatmap = np.uint8(255 * heatmap.numpy())
jet = plt.get_cmap('jet')
heatmap_jet = jet(heatmap)[:, :, :3]
superimposed_img = heatmap_jet * 0.4 + img_array[0]
superimposed_img = np.clip(superimposed_img, 0, 1)

# Save the superimposed image
plt.imsave(file_path, superimposed_img)

return {'percentage': label, 'result': predicted_label}
```

`src/lib/actions.ts:145-156`:

```typescript
const predictionResponse = await fetch("http://127.0.0.1:5000/api/predict", {
  body: formData,
  method: "POST",
});

const data = await predictionResponse.json();
percentage = data.percentage;
diagnosis = data.result;
```

`src/lib/db-schema.ts:64-76`:

```typescript
export const results = pgTable("results", {
  result_id: serial("result_id").primaryKey(),
  doctor_id: integer("doctor_id")
    .references(() => users.user_id)
    .notNull(),
  user_id: integer("user_id")
    .references(() => users.user_id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  ultrasound_image: text("ultrasound_image").notNull(),
  percentage: text("percentage").notNull(),
  diagnosis: text("diagnosis").notNull(),
});
```

## Commands you will need

| Purpose             | Command                          | Expected on success |
| ------------------- | -------------------------------- | ------------------- |
| Typecheck           | `bun x tsc --noEmit`             | exit 0, no errors   |
| Build check         | `bun run build`                  | exit 0              |
| Python check        | `python3 -m py_compile index.py` | exit 0              |
| Drizzle schema push | `bun run drizzle:push`           | exit 0              |

## Scope

**In scope**:

- `index.py` — Return base64-encoded Grad-CAM PNG in the prediction response JSON.
- `src/lib/db-schema.ts` — Add `gradcam_image: text("gradcam_image")` to `results` table.
- `src/lib/actions.ts` — Decode Grad-CAM base64 buffer, upload to Vercel Blob (`gradcam-images/...`), and record in `results.insert`.
- `src/lib/dal.ts` — Add `gradcam_image` to `Result` and `PatientResult` types and SQL queries (`getResultById`, `getPatientResults`, `getResultsByPatientId`).
- `src/app/doctor/results/[id]/image-comparator.tsx` — Create client component allowing clinicians to toggle or view side-by-side: Raw Scan vs Grad-CAM Activation Heatmap.
- `src/app/doctor/results/[id]/page.tsx` — Embed the image comparator component into the result detail view.

**Out of scope**:

- Do NOT modify the model weights file `MobileNetModelPCOS.h5`.
- Do NOT modify patient-facing routes in this plan (`src/app/patient/*` is covered in Plan 007).
- Do NOT alter authentication or session management (`src/lib/session.ts`).

## Git workflow

- Branch: `feat/006-gradcam-explainability`
- Commits: Conventional commit style, matching repo history (e.g. `feat(ml): return and store gradcam explainability heatmaps`, `feat(ui): add scan and gradcam comparison viewer`).

## Steps

### Step 1: Update Flask API (`index.py`) to return Grad-CAM image

In `index.py`:

1. Import `base64` and `io`.
2. After computing `superimposed_img` in `upload()`, convert `superimposed_img` (which is a float array scaled 0 to 1) into uint8 (`(superimposed_img * 255).astype(np.uint8)`), convert to a PIL Image, save to an in-memory `io.BytesIO` buffer as PNG, and encode to a base64 string:
   ```python
   pil_heatmap = Image.fromarray((superimposed_img * 255).astype(np.uint8))
   buffer = io.BytesIO()
   pil_heatmap.save(buffer, format='PNG')
   gradcam_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
   ```
3. Return `gradcam_base64` in the JSON response:
   ```python
   return {
       'percentage': label,
       'result': predicted_label,
       'gradcam_image': gradcam_base64,
   }
   ```
4. If `is_grayscale(image)` is False (invalid image), return `{'percentage': '0%', 'result': 'Invalid', 'gradcam_image': None}`.

**Verify**:
`python3 -m py_compile index.py` &rarr; exit 0

### Step 2: Add `gradcam_image` to Drizzle database schema

In `src/lib/db-schema.ts`:

1. Add `gradcam_image: text("gradcam_image")` to `results` table:
   ```typescript
   export const results = pgTable("results", {
     result_id: serial("result_id").primaryKey(),
     doctor_id: integer("doctor_id")
       .references(() => users.user_id)
       .notNull(),
     user_id: integer("user_id")
       .references(() => users.user_id)
       .notNull(),
     created_at: timestamp("created_at").defaultNow().notNull(),
     ultrasound_image: text("ultrasound_image").notNull(),
     gradcam_image: text("gradcam_image"),
     percentage: text("percentage").notNull(),
     diagnosis: text("diagnosis").notNull(),
   });
   ```

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 3: Handle Grad-CAM upload in Next.js Server Action (`src/lib/actions.ts`)

In `src/lib/actions.ts`:

1. In `addPatient`, extract `gradcam_image` from `data`:
   ```typescript
   let gradcamImageBlobName: string | null = null;
   if (data.gradcam_image) {
     const gradcamBuffer = Buffer.from(data.gradcam_image, "base64");
     const originalNameWithoutExt = parsedData.data.ultrasound_image.name.replace(/\.[^/.]+$/, "");
     const gradcamBlob = await put(
       `gradcam-images/${originalNameWithoutExt}-gradcam.png`,
       gradcamBuffer,
       {
         access: "public",
         addRandomSuffix: true,
       },
     );
     gradcamImageBlobName = gradcamBlob.pathname.replace(/^gradcam-images\//, "");
   }
   ```
2. Include `gradcam_image: gradcamImageBlobName` in the `db.insert(results).values({ ... })` call.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 4: Update DAL types and queries (`src/lib/dal.ts`)

In `src/lib/dal.ts`:

1. Update `Result` and `PatientResult` interfaces to add `gradcam_image: string | null;`.
2. Verify that queries using `SELECT "results".*` automatically include `gradcam_image`.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0

### Step 5: Build Image Comparison Component and Integrate into Doctor Result Page

1. Create `src/app/doctor/results/[id]/image-comparator.tsx`:
   - Client component with state (`activeTab: "original" | "gradcam" | "side-by-side"`).
   - Renders the raw ultrasound image and the Grad-CAM explainability image using `next/image`.
   - Displays a badge/disclaimer: _"Grad-CAM indicates feature activation regions used by the neural network during inference. This is an assistive guide and does not replace manual radiologic evaluation."_
2. In `src/app/doctor/results/[id]/page.tsx`:
   - Replace the single `<Image>` tag with `<ImageComparator ultrasoundImage={result.ultrasound_image} gradcamImage={result.gradcam_image} />`.

**Verify**:
`bun x tsc --noEmit` &rarr; exit 0
`bun run build` &rarr; exit 0

## Done criteria

- [ ] `python3 -m py_compile index.py` exits 0.
- [ ] `index.py` returns `gradcam_image` (base64 string) in the `/api/predict` response.
- [ ] `src/lib/db-schema.ts` includes `gradcam_image: text("gradcam_image")` in `results`.
- [ ] `src/lib/actions.ts:addPatient` uploads Grad-CAM image to Vercel Blob under `gradcam-images/` and stores its key.
- [ ] `src/lib/dal.ts` includes `gradcam_image` on `Result` and `PatientResult` interfaces.
- [ ] `src/app/doctor/results/[id]/page.tsx` renders the comparator component with raw ultrasound and Grad-CAM view.
- [ ] `bun x tsc --noEmit` exits 0.
- [ ] `bun run build` exits 0.
- [ ] No files outside the in-scope list are modified (`git status`).
- [ ] Status updated to `DONE` in `plans/README.md`.

## STOP conditions

- If `index.py` fails to generate Grad-CAM on ultrasound images, verify that `grad_model` outputs `[last_conv_layer.output, model.output]`.
- If Next.js Image component fails to load `gradcam-images/**`, verify that `next.config.js` `remotePatterns` matches `pathname: "/**"` (confirmed in `next.config.js:14`).
- If `bun x tsc --noEmit` reports errors on `Result` interface consumers, check for missing optional property `gradcam_image?: string | null`.

## Maintenance notes

- Future plans (such as PDF generation in Plan 010) can include both the raw ultrasound and the Grad-CAM heatmap in the exported clinical report.
- The `jet` colormap in `index.py` produces blue-to-red activations (red = highest importance). If clinic radiologists prefer a different colormap (e.g. `viridis` or `magma`), change the colormap name in `plt.get_cmap(...)`.
