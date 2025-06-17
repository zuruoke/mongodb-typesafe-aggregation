import { PipelineStage, Types } from 'mongoose';

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
