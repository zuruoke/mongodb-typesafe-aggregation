import { PipelineStage } from 'mongoose';

/**
 * The default field name for metadata in documents
 */
export const DEFAULT_METADATA_FIELD = 'metadata';

/**
 * Configuration for metadata field population
 */
interface MetadataPopulateConfig {
  /** The collection name to lookup from */
  collection: string;
  /** The field name to output the populated data as */
  as?: string;
  /** Fields to exclude from the populated document */
  excludeFields?: string[];
}

/**
 * Configuration for building a metadata population pipeline
 */
interface BuildMetadataPipelineConfig {
  /** The ID field within the metadata object */
  idField: string;
  /** Configuration for the population */
  config: MetadataPopulateConfig;
}

/**
 * Gets the output field name for a lookup operation
 * @param idField - The ID field name
 * @param config - The lookup configuration
 * @returns The output field name
 */
function getOutputFieldName(
  idField: string,
  config: MetadataPopulateConfig,
): string {
  return config.as || idField.replace(/Ids?$/, '');
}

/**
 * Gets the full field path for a metadata field
 * @param field - The field name within metadata
 * @returns The full field path
 */
function getFieldPath(field: string): string {
  return `${DEFAULT_METADATA_FIELD}.${field}`;
}

/**
 * Builds a pipeline stage to cast string IDs to ObjectId
 * @param fieldPath - The path to the field containing the ID
 * @returns A pipeline stage that casts the ID to ObjectId
 */
function buildCastIdStage(fieldPath: string): PipelineStage {
  return {
    $addFields: {
      [fieldPath]: {
        $toObjectId: `$${fieldPath}`,
      },
    },
  };
}

/**
 * Builds a pipeline stage to cast an array of string IDs to ObjectIds
 * @param fieldPath - The path to the field containing the array of IDs
 * @returns A pipeline stage that casts the array of IDs to ObjectIds
 */
function buildCastIdsStage(fieldPath: string): PipelineStage {
  return {
    $addFields: {
      [fieldPath]: {
        $map: {
          input: `$${fieldPath}`,
          as: 'id',
          in: { $toObjectId: '$$id' },
        },
      },
    },
  };
}

/**
 * Builds a lookup stage for populating metadata
 * @param config - The configuration for the lookup
 * @returns A pipeline stage that performs the lookup
 */
function buildLookupStage(config: BuildMetadataPipelineConfig): PipelineStage {
  const { idField, config: lookupConfig } = config;
  const asField = getOutputFieldName(idField, lookupConfig);
  const localFieldPath = getFieldPath(idField);
  const asFieldPath = getFieldPath(asField);

  return {
    $lookup: {
      from: lookupConfig.collection,
      localField: localFieldPath,
      foreignField: '_id',
      as: asFieldPath,
    },
  };
}

/**
 * Builds a condition to check if an array is empty
 * @param arrayPath - The path to the array field
 * @returns A condition that checks if the array is empty
 */
function buildEmptyArrayCondition(arrayPath: string): Record<string, unknown> {
  return {
    $eq: [{ $size: `$${arrayPath}` }, 0],
  };
}

/**
 * Builds a condition to check if a field is null
 * @param fieldPath - The path to the field
 * @returns A condition that checks if the field is null
 */
function buildNullCondition(fieldPath: string): Record<string, unknown> {
  return {
    $eq: [`$${fieldPath}`, null],
  };
}

/**
 * Builds a pipeline stage that removes a specific field if its value is null
 * @param fieldPath - The dot notation path to the field (e.g. "propertyId" or "metadata.contractorId")
 * @returns A pipeline stage that removes the field if it is null
 */
function buildRemoveNullFieldStage(fieldPath: string): PipelineStage {
  return {
    $addFields: {
      [fieldPath]: {
        $cond: {
          if: buildNullCondition(fieldPath),
          then: '$$REMOVE',
          else: `$${fieldPath}`,
        },
      },
    },
  };
}

/**
 * Builds a stage to handle the lookup result for a single document
 * @param fieldPath - The path to the field containing the lookup result
 * @returns A pipeline stage that processes the lookup result
 */
function buildSingleLookupResultStage(fieldPath: string): PipelineStage {
  return {
    $addFields: {
      [fieldPath]: {
        $cond: {
          if: buildEmptyArrayCondition(fieldPath),
          then: '$$REMOVE',
          else: { $arrayElemAt: [`$${fieldPath}`, 0] },
        },
      },
    },
  };
}

/**
 * Builds a stage to handle the lookup result for an array of documents
 * @param fieldPath - The path to the field containing the lookup result
 * @returns A pipeline stage that processes the lookup result
 */
function buildArrayLookupResultStage(fieldPath: string): PipelineStage {
  return {
    $addFields: {
      [fieldPath]: {
        $cond: {
          if: buildEmptyArrayCondition(fieldPath),
          then: '$$REMOVE',
          else: `$${fieldPath}`,
        },
      },
    },
  };
}

/**
 * Builds a stage to handle the lookup result
 * @param config - The configuration for handling the lookup result
 * @returns A pipeline stage that processes the lookup result
 */
function buildLookupResultStage(
  config: BuildMetadataPipelineConfig,
): PipelineStage {
  const { idField, config: lookupConfig } = config;
  const asField = getOutputFieldName(idField, lookupConfig);
  const fieldPath = getFieldPath(asField);
  const isArray = idField.endsWith('Ids');

  return isArray
    ? buildArrayLookupResultStage(fieldPath)
    : buildSingleLookupResultStage(fieldPath);
}

/**
 * Builds a project stage to exclude sensitive fields
 * @param config - The configuration for the project stage
 * @returns A pipeline stage that excludes sensitive fields
 */
function buildProjectStage(
  config: BuildMetadataPipelineConfig,
): PipelineStage | null {
  const { config: lookupConfig } = config;
  const asField = getOutputFieldName(config.idField, lookupConfig);
  const excludeFields = lookupConfig.excludeFields || [];

  if (excludeFields.length === 0) {
    return null;
  }

  const project: Record<string, number> = {};
  excludeFields.forEach((field) => {
    project[getFieldPath(`${asField}.${field}`)] = 0;
  });

  return {
    $project: project,
  };
}

/**
 * Builds pipeline stages for a single metadata field
 * @param config - The configuration for the metadata field
 * @returns An array of pipeline stages
 */
function buildMetadataFieldStages(
  config: BuildMetadataPipelineConfig,
): PipelineStage[] {
  const { idField } = config;
  const isArray = idField.endsWith('Ids');
  const fieldPath = getFieldPath(idField);

  const stages: PipelineStage[] = [
    // Cast IDs to ObjectId
    isArray ? buildCastIdsStage(fieldPath) : buildCastIdStage(fieldPath),
    // Perform lookup
    buildLookupStage(config),
    // Handle lookup result
    buildLookupResultStage(config),
    // Remove null fields
    buildRemoveNullFieldStage(fieldPath),
  ];

  // Only add project stage if there are fields to exclude
  const projectStage = buildProjectStage(config);
  if (projectStage) {
    stages.push(projectStage);
  }

  return stages;
}

/**
 * Builds a complete pipeline for populating metadata fields
 * @param configs - Array of configurations for metadata population
 * @returns An array of pipeline stages
 */
export function buildMetadataPopulationPipeline(
  configs: BuildMetadataPipelineConfig[],
): PipelineStage[] {
  return configs.flatMap(buildMetadataFieldStages);
}
