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
 * @template T - The type of the documents in the collection.
 */
export class PipelineBuilder<T> {
  private stages: PipelineStage[] = [];

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
   * Adds a raw pipeline stage to the builder.
   *
   * @param stage - The pipeline stage to add.
   * @returns The builder instance.
   */
  public raw(stage: PipelineStage): this {
    this.stages.push(stage);
    return this;
  }

  /**
   * Adds a `$match` stage to the builder.
   *
   * @param filter - The filter to apply to the documents.
   * @returns The builder instance.
   */
  public match(filter: MatchFilter<T>): this {
    this.stages.push(matchStage(filter));
    return this;
  }

  /**
   * Adds a `$lookup` stage to the builder.
   *
   * @param spec - The specification for the `$lookup` stage.
   * @returns The builder instance.
   */
  public lookup<U extends Record<string, unknown>>(
    spec: LookupSpec<T>,
  ): PipelineBuilder<Merge<T, U>> {
    const newStages = [...this.stages, lookupStage(spec)];
    return new PipelineBuilder<Merge<T, U>>(newStages as PipelineStage[]);
  }

  /**
   * Adds a `$group` stage to the builder.
   *
   * @param spec - The specification for the `$group` stage.
   * @returns The builder instance.
   */
  public group<G extends Record<string, unknown>>(
    spec: GroupSpec<T>,
  ): PipelineBuilder<G> {
    const newStages = [...this.stages, groupStage(spec)];
    return new PipelineBuilder<G>(newStages as PipelineStage[]);
  }

  /**
   * Adds a `$addFields` stage to the builder.
   *
   * @param spec - The specification for the `$addFields` stage.
   * @returns The builder instance.
   */
  public addFields<U extends Record<string, unknown>>(
    spec: AddFieldsSpec<T>,
  ): PipelineBuilder<Merge<T, U>> {
    const newStages = [...this.stages, addFieldsStage(spec)];
    return new PipelineBuilder<Merge<T, U>>(newStages as PipelineStage[]);
  }

  /**
   * Adds a `$project` stage to the builder.
   *
   * @param spec - The specification for the `$project` stage.
   * @returns The builder instance.
   */
  public project<G extends Record<string, unknown>>(
    spec: ProjectSpec<T>,
  ): PipelineBuilder<G> {
    const newStages = [...this.stages, projectStage(spec)];
    return new PipelineBuilder<G>(newStages as PipelineStage[]);
  }

  /**
   * Adds a `$sort` stage to the builder.
   *
   * @param spec - The specification for the `$sort` stage.
   * @returns The builder instance.
   */
  public sort(spec: Partial<Record<keyof T, 1 | -1>>): this {
    this.stages.push(sortStage(spec) as PipelineStage);
    return this;
  }

  /**
   * Adds a `$skip` stage to the builder.
   *
   * @param count - The number of documents to skip.
   * @returns The builder instance.
   */
  public skip(count: number): this {
    this.stages.push(skipStage(count));
    return this;
  }

  /**
   * Adds a `$limit` stage to the builder.
   *
   * @param count - The number of documents to limit.
   * @returns The builder instance.
   */
  public limit(count: number): this {
    this.stages.push(limitStage(count));
    return this;
  }

  /**
   * Adds a `$facet` stage to the builder.
   *
   * @param spec - The specification for the `$facet` stage.
   * @returns The builder instance.
   */
  public facet<G extends Record<string, unknown>>(
    spec: FacetSpec<T>,
  ): PipelineBuilder<G> {
    const newStages = [...this.stages, facetStage(spec)];
    return new PipelineBuilder<G>(newStages as PipelineStage[]);
  }

  /**
   * Adds a `$unwind` stage to the builder.
   *
   * @param spec - The specification for the `$unwind` stage.
   * @returns The builder instance.
   */
  public unwind<G extends Record<string, unknown>>(
    spec: string | UnwindSpec<T>,
  ): PipelineBuilder<G> {
    const newStages = [...this.stages, unwindStage(spec)];
    return new PipelineBuilder<G>(newStages as PipelineStage[]);
  }

  /**
   * Adds a `$replaceRoot` stage to the builder.
   *
   * @param spec - The specification for the `$replaceRoot` stage.
   * @returns The builder instance.
   */
  public replaceRoot<G extends Record<string, unknown>>(
    spec: ReplaceRootSpec<T>,
  ): PipelineBuilder<G> {
    const newStages = [...this.stages, replaceRootStage(spec)];
    return new PipelineBuilder<G>(newStages as PipelineStage[]);
  }

  /**
   * Adds a `$count` stage to the builder.
   *
   * @param fieldName - The field to count.
   * @returns The builder instance.
   */
  public count(fieldName: string): PipelineBuilder<{ [k: string]: number }> {
    const newStages = [...this.stages, countStage(fieldName)];
    return new PipelineBuilder<{ [k: string]: number }>(newStages);
  }

  /**
   * Adds a `$unionWith` stage to the builder.
   *
   * @param spec - The specification for the `$unionWith` stage.
   * @returns The builder instance.
   */
  public unionWith(spec: UnionWithSpec<T>): this {
    this.stages.push(unionWithStage(spec) as PipelineStage);
    return this;
  }

  public set<U extends Record<string, any>>(
    spec: U,
  ): PipelineBuilder<Merge<T, U>> {
    const newStages = [...this.stages, setStage(spec)];
    return new PipelineBuilder<Merge<T, U>>(newStages as PipelineStage[]);
  }

  public unset(fields: string | string[]): this {
    this.stages.push(unsetStage(fields));
    return this;
  }

  /**
   * Adds a `$merge` stage to the builder.
   *
   * @param spec - The specification for the `$merge` stage.
   * @returns The builder instance.
   */
  public merge(spec: MergeSpec<T>): this {
    this.stages.push(mergeStage(spec) as PipelineStage);
    return this;
  }

  /**
   * Adds a `$graphLookup` stage to the builder.
   *
   * @param spec - The specification for the `$graphLookup` stage.
   * @returns The builder instance.
   */
  public graphLookup(spec: GraphLookupSpec<T>): this {
    this.stages.push(graphLookupStage(spec));
    return this;
  }

  /**
   * Adds a `$bucket` stage to the builder.
   *
   * @param spec - The specification for the `$bucket` stage.
   * @returns The builder instance.
   */
  public bucket<T>(spec: BucketSpec<T>): this {
    this.stages.push(bucketStage(spec) as PipelineStage);
    return this;
  }

  /**
   * Adds a `$bucketAuto` stage to the builder.
   *
   * @param spec - The specification for the `$bucketAuto` stage.
   * @returns The builder instance.
   */
  public bucketAuto(spec: BucketAutoSpec<T>): this {
    this.stages.push(bucketAutoStage(spec) as PipelineStage);
    return this;
  }

  /**
   * Adds a `$redact` stage to the builder.
   *
   * @param spec - The specification for the `$redact` stage.
   * @returns The builder instance.
   */
  public redact(spec: RedactSpec<T>): this {
    this.stages.push(redactStage(spec));
    return this;
  }
}
