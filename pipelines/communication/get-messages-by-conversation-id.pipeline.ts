import { PipelineStage, Types } from 'mongoose';
import { COLLECTION_NAMES } from '@lightwork/database/src/schema/constants/collection-names.constants';

export const getMessagesByConversationIdPipeline = (
  conversationId: string,
): PipelineStage[] => [
  {
    $match: {
      conversationId: new Types.ObjectId(conversationId),
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAMES.USERS,
      let: { senderId: '$metadata.senderId' },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $ne: ['$$senderId', null] },
                { $eq: ['$_id', '$$senderId'] },
              ],
            },
          },
        },
        {
          $project: {
            password: 0,
          },
        },
      ],
      as: 'senderDetails',
    },
  },
  {
    $unwind: {
      path: '$senderDetails',
      preserveNullAndEmptyArrays: true,
    },
  },
];
