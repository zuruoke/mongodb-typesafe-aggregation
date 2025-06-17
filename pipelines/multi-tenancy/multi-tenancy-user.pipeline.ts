import { CompaniesDocument } from '@lightwork/database/src/schema/collections/auth/companies.model';
import { OfficesDocument } from '@lightwork/database/src/schema/collections/auth/offices.model';
import { UsersDocument } from '@lightwork/database/src/schema/collections/auth/users.model';
import { COLLECTION_NAMES } from '@lightwork/database/src/schema/constants/collection-names.constants';
import { ObjectId } from 'bson';
import { PipelineStage } from 'mongoose';
import {
  companiesGetMultiTenancyProjects,
  officeGetMultiTenancyProjects,
  userGetMultiTenancyProjects,
} from '../../../types';
import { createProjectStageWithAdditional } from '../../../utils';

export const buildMultiTenancyUserDataPipeline = (
  tenantId: string,
): PipelineStage[] => [
  {
    $match: {
      _id: new ObjectId(tenantId),
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAMES.COMPANIES,
      let: { companyId: '$companyId' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$companyId'] },
          },
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.ADDRESS,
            let: { addressId: '$addressId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$addressId'] },
                },
              },
            ],
            as: 'address',
          },
        },
        {
          $unwind: {
            path: '$address',
            preserveNullAndEmptyArrays: true,
          },
        },
        createProjectStageWithAdditional<CompaniesDocument>(
          companiesGetMultiTenancyProjects,
          { address: 1 },
        ),
      ],
      as: 'company',
    },
  },
  {
    $unwind: {
      path: '$company',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAMES.OFFICES,
      let: { officeId: '$officeId' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$_id', '$$officeId'] },
          },
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.ADDRESS,
            let: { addressId: '$addressId' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$_id', '$$addressId'] },
                },
              },
            ],
            as: 'address',
          },
        },
        {
          $unwind: {
            path: '$address',
            preserveNullAndEmptyArrays: true,
          },
        },
        createProjectStageWithAdditional<OfficesDocument>(
          officeGetMultiTenancyProjects,
          { address: 1 },
        ),
      ],
      as: 'office',
    },
  },
  {
    $unwind: {
      path: '$office',
      preserveNullAndEmptyArrays: true,
    },
  },
  createProjectStageWithAdditional<UsersDocument>(userGetMultiTenancyProjects, {
    office: 1,
    company: 1,
  }),
];
