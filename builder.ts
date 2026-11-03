import { matchStage } from './stages/match';
import { lookupStage, LookupSpec } from './stages/lookup';
import { groupStage, GroupSpec } from './stages/group';
import { addFieldsStage, AddFieldsSpec } from './stages/add-fields';
import { projectStage, ProjectSpec } from './stages/project';
import { sortStage } from './stages/sort';
import { skipStage } from './stages/skip';
import { limitStage } from './stages/limit';
import { facetStage, FacetSpec } from './stages/facet';
import { unwindStage, UnwindSpec } from './stages/unwind';
import { replaceRootStage, ReplaceRootSpec } from './stages/replace-root';
import { countStage } from './stages/count';
import { unionWithStage, UnionWithSpec } from './stages/union-with';
import { setStage } from './stages/set-stage';
import { unsetStage } from './stages/unset_stage';
import { mergeStage, MergeSpec } from './stages/merge';
import { graphLookupStage, GraphLookupSpec } from './stages/graph-lookup';
import { bucketStage, BucketSpec } from './stages/bucket';
import { bucketAutoStage, BucketAutoSpec } from './stages/bucket-auto';
import { redactStage, RedactSpec } from './stages/redact';
import { PipelineStage } from 'mongoose';
import { MatchFilter, Merge } from './types';

/**
 * Builder class for constructing MongoDB aggregation pipelines.
 *
 * Every stage method returns a new builder and leaves the original unchanged, so a partially
 * built pipeline can be reused as the base of several others.
 *
 * @template T - The type of the documents in the collection.
 */
export class PipelineBuilder<T> {
  private readonly stages: PipelineStage[] = [];

  constructor(initialStages?: PipelineStage[]) {
    if (initialStages) {
      this.stages = [...initialStages];
    }
  }

  /**
   * Builds the final aggregation pipeline.
   *
   * @returns The final aggregation pipeline.
   */
  public build(): PipelineStage[] {
    return [...this.stages];
  }

  /**
   * Returns a new builder with `stage` appended, leaving this one unchanged.
   */
  private next<U = T>(stage: object): PipelineBuilder<U> {
    return new PipelineBuilder<U>([...this.stages, stage as PipelineStage]);
  }

  /**
   * Adds a raw pipeline stage to the builder.
   *
   * @param stage - The pipeline stage to add.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public raw(stage: PipelineStage): PipelineBuilder<T> {
    return this.next(stage);
  }

  /**
   * Adds a `$match` stage to the builder.
   *
   * @param filter - The filter to apply to the documents.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public match(filter: MatchFilter<T>): PipelineBuilder<T> {
    return this.next(matchStage(filter));
  }

  /**
   * Adds a `$lookup` stage to the builder.
   *
   * @param spec - The specification for the `$lookup` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public lookup<U extends Record<string, unknown>>(
    spec: LookupSpec<T>,
  ): PipelineBuilder<Merge<T, U>> {
    return this.next<Merge<T, U>>(lookupStage(spec));
  }

  /**
   * Adds a `$group` stage to the builder.
   *
   * @param spec - The specification for the `$group` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public group<G extends Record<string, unknown>>(spec: GroupSpec<T>): PipelineBuilder<G> {
    return this.next<G>(groupStage(spec));
  }

  /**
   * Adds a `$addFields` stage to the builder.
   *
   * @param spec - The specification for the `$addFields` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public addFields<U extends Record<string, unknown>>(
    spec: AddFieldsSpec<T>,
  ): PipelineBuilder<Merge<T, U>> {
    return this.next<Merge<T, U>>(addFieldsStage(spec));
  }

  /**
   * Adds a `$project` stage to the builder.
   *
   * @param spec - The specification for the `$project` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public project<G extends Record<string, unknown>>(spec: ProjectSpec<T>): PipelineBuilder<G> {
    return this.next<G>(projectStage(spec));
  }

  /**
   * Adds a `$sort` stage to the builder.
   *
   * @param spec - The specification for the `$sort` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public sort(spec: Partial<Record<keyof T, 1 | -1>>): PipelineBuilder<T> {
    return this.next(sortStage(spec));
  }

  /**
   * Adds a `$skip` stage to the builder.
   *
   * @param count - The number of documents to skip.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public skip(count: number): PipelineBuilder<T> {
    return this.next(skipStage(count));
  }

  /**
   * Adds a `$limit` stage to the builder.
   *
   * @param count - The number of documents to limit.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public limit(count: number): PipelineBuilder<T> {
    return this.next(limitStage(count));
  }

  /**
   * Adds a `$facet` stage to the builder.
   *
   * @param spec - The specification for the `$facet` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public facet<G extends Record<string, unknown>>(spec: FacetSpec<T>): PipelineBuilder<G> {
    return this.next<G>(facetStage(spec));
  }

  /**
   * Adds a `$unwind` stage to the builder.
   *
   * @param spec - The specification for the `$unwind` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public unwind<G extends Record<string, unknown>>(
    spec: string | UnwindSpec<T>,
  ): PipelineBuilder<G> {
    return this.next<G>(unwindStage(spec));
  }

  /**
   * Adds a `$replaceRoot` stage to the builder.
   *
   * @param spec - The specification for the `$replaceRoot` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public replaceRoot<G extends Record<string, unknown>>(
    spec: ReplaceRootSpec<T>,
  ): PipelineBuilder<G> {
    return this.next<G>(replaceRootStage(spec));
  }

  /**
   * Adds a `$count` stage to the builder.
   *
   * @param fieldName - The field to count.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public count(fieldName: string): PipelineBuilder<{ [k: string]: number }> {
    return this.next<{ [k: string]: number }>(countStage(fieldName));
  }

  /**
   * Adds a `$unionWith` stage to the builder.
   *
   * @param spec - The specification for the `$unionWith` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public unionWith(spec: UnionWithSpec<T>): PipelineBuilder<T> {
    return this.next(unionWithStage(spec));
  }

  public set<U extends Record<string, any>>(spec: U): PipelineBuilder<Merge<T, U>> {
    return this.next<Merge<T, U>>(setStage(spec));
  }

  public unset(fields: string | string[]): PipelineBuilder<T> {
    return this.next(unsetStage(fields));
  }

  /**
   * Adds a `$merge` stage to the builder.
   *
   * @param spec - The specification for the `$merge` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public merge(spec: MergeSpec<T>): PipelineBuilder<T> {
    return this.next(mergeStage(spec));
  }

  /**
   * Adds a `$graphLookup` stage to the builder.
   *
   * @param spec - The specification for the `$graphLookup` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public graphLookup(spec: GraphLookupSpec<T>): PipelineBuilder<T> {
    return this.next(graphLookupStage(spec));
  }

  /**
   * Adds a `$bucket` stage to the builder.
   *
   * @param spec - The specification for the `$bucket` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public bucket<V>(spec: BucketSpec<V>): PipelineBuilder<T> {
    return this.next(bucketStage(spec));
  }

  /**
   * Adds a `$bucketAuto` stage to the builder.
   *
   * @param spec - The specification for the `$bucketAuto` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public bucketAuto(spec: BucketAutoSpec<T>): PipelineBuilder<T> {
    return this.next(bucketAutoStage(spec));
  }

  /**
   * Adds a `$redact` stage to the builder.
   *
   * @param spec - The specification for the `$redact` stage.
   * @returns A new builder with the stage added; this builder is unchanged.
   */
  public redact(spec: RedactSpec<T>): PipelineBuilder<T> {
    return this.next(redactStage(spec));
  }
}
