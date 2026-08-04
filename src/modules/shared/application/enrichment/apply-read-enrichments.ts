/**
 * Composable post-read enrichment steps for use cases.
 * Persistence stays free of cross-module repositories.
 *
 * Homogeneous steps keep TItem. A leading transform step may widen TIn → TOut;
 * following steps then operate on TOut.
 */
export type ReadEnrichmentStep<TIn, TOut, TContext> = {
  when: (ctx: TContext) => boolean;
  apply: (items: TIn[], ctx: TContext) => Promise<TOut[]>;
};

/** Homogeneous enrichments (T → T). */
export async function applyReadEnrichments<TItem, TContext>(
  items: readonly TItem[],
  ctx: TContext,
  steps: readonly ReadEnrichmentStep<TItem, TItem, TContext>[],
): Promise<TItem[]>;

/**
 * First step may widen TIn → TOut; remaining steps are TOut → TOut.
 * Skipped transform steps are unsafe when TOut is not assignable from TIn —
 * prefer always-on `when` for widening steps.
 */
export async function applyReadEnrichments<TIn, TOut, TContext>(
  items: readonly TIn[],
  ctx: TContext,
  steps: readonly [
    ReadEnrichmentStep<TIn, TOut, TContext>,
    ...ReadEnrichmentStep<TOut, TOut, TContext>[],
  ],
): Promise<TOut[]>;

export async function applyReadEnrichments(
  items: readonly unknown[],
  ctx: unknown,
  steps: readonly ReadEnrichmentStep<unknown, unknown, unknown>[],
): Promise<unknown[]> {
  let current = [...items];

  for (const step of steps) {
    if (!step.when(ctx)) {
      continue;
    }
    current = await step.apply(current, ctx);
  }

  return current;
}
