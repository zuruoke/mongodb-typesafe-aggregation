import { PipelineStage } from 'mongoose';
import { buildMetadataPopulationPipeline } from '../../populate-metadata';
import { COLLECTION_NAMES } from '@lightwork/database/src/schema/constants/collection-names.constants';

/**
 * Builds a pipeline for populating events metadata
 * @returns An array of pipeline stages for populating events metadata
 */
export function buildEventsMetadataPipeline(): PipelineStage[] {
  return buildMetadataPopulationPipeline([
    {
      idField: 'certificateId',
      config: {
        collection: COLLECTION_NAMES.COMPLIANCE_CERTIFICATES,
        as: 'certificate',
      },
    },
    {
      idField: 'renewalId',
      config: {
        collection: COLLECTION_NAMES.COMPLIANCE_RENEWALS,
        as: 'renewal',
      },
    },
    {
      idField: 'workOrderId',
      config: {
        collection: COLLECTION_NAMES.WORK_ORDERS,
        as: 'workOrder',
      },
    },
    {
      idField: 'documentIds',
      config: {
        collection: COLLECTION_NAMES.COMPLIANCE_DOCUMENTS,
        as: 'documents',
      },
    },
    {
      idField: 'documentId',
      config: {
        collection: COLLECTION_NAMES.COMPLIANCE_DOCUMENTS,
        as: 'document',
      },
    },
    {
      idField: 'quoteId',
      config: {
        collection: COLLECTION_NAMES.QUOTES,
        as: 'quote',
      },
    },
    {
      idField: 'quoteIds',
      config: {
        collection: COLLECTION_NAMES.QUOTES,
        as: 'quotes',
      },
    },
    {
      idField: 'rejectedBy',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'rejectedBy',
        excludeFields: ['password'],
      },
    },
    {
      idField: 'contractorId',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'contractor',
      },
    },
    {
      idField: 'contractorIds',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'contractors',
        excludeFields: ['password'],
      },
    },
    {
      idField: 'prospectIds',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'prospects',
        excludeFields: ['password'],
      },
    },
    {
      idField: 'maintenanceRequestId',
      config: {
        collection: COLLECTION_NAMES.MAINTENANCE_REQUESTS,
        as: 'maintenanceRequest',
      },
    },
    {
      idField: 'unitId',
      config: {
        collection: COLLECTION_NAMES.UNITS,
        as: 'unit',
      },
    },
    {
      idField: 'propertyId',
      config: {
        collection: COLLECTION_NAMES.PROPERTIES,
        as: 'property',
      },
    },
    {
      idField: 'userId',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'user',
        excludeFields: ['password'],
      },
    },
    {
      idField: 'viewingId',
      config: {
        collection: COLLECTION_NAMES.VIEWINGS,
        as: 'viewing',
      },
    },
    {
      idField: 'approvedBy',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'approvedByUser',
        excludeFields: ['password'],
      },
    },
    {
      idField: 'scheduledBy',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'scheduledByUser',
        excludeFields: ['password'],
      },
    },
    {
      idField: 'completedBy',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'completedByUser',
        excludeFields: ['password'],
      },
    },
    {
      idField: 'tenantId',
      config: {
        collection: COLLECTION_NAMES.USERS,
        as: 'tenant',
        excludeFields: ['password'],
      },
    },
  ]);
}
