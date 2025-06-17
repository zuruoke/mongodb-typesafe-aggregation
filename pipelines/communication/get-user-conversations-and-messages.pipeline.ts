import { COLLECTION_NAMES } from '@lightwork/database/src/schema/constants';
import { PipelineStage } from 'mongoose';

export const getUserConversationsPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: COLLECTION_NAMES.USERS,
      let: { participantIds: '$participantIds' },
      pipeline: [
        {
          $match: {
            $expr: { $in: ['$_id', '$$participantIds'] },
          },
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            phone: 1,
            email: 1,
          },
        },
      ],
      as: 'userParticipants',
    },
  },
  {
    $addFields: {
      participantDetails: {
        $map: {
          input: '$participantIds',
          as: 'participantId',
          in: {
            $let: {
              vars: {
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$userParticipants',
                        as: 'u',
                        cond: { $eq: ['$$u._id', '$$participantId'] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: {
                _id: '$$participantId',
                participantName: {
                  $cond: {
                    if: { $and: ['$$user.firstName', '$$user.lastName'] },
                    then: {
                      $concat: ['$$user.firstName', ' ', '$$user.lastName'],
                    },
                    else: 'Unknown User',
                  },
                },
                participantContact: { $ifNull: ['$$user.phone', ''] },
                participantEmail: { $ifNull: ['$$user.email', ''] },
              },
            },
          },
        },
      },
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAMES.MESSAGES,
      localField: '_id',
      foreignField: 'conversationId',
      as: 'messages',
      pipeline: [
        { $sort: { timestamp: -1 } },
        {
          $addFields: {
            participantDetails: {
              $let: {
                vars: {
                  participant: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$$ROOT.participantDetails',
                          as: 'p',
                          cond: { $eq: ['$$p._id', '$participantId'] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  _id: '$participantId',
                  participantName: {
                    $ifNull: ['$$participant.participantName', 'Unknown User'],
                  },
                  participantContact: {
                    $ifNull: ['$$participant.participantContact', ''],
                  },
                  participantEmail: {
                    $ifNull: ['$$participant.participantEmail', ''],
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
  {
    $project: {
      _id: 1,
      conversationType: 1,
      participantId: 1,
      participantName: 1,
      officeId: 1,
      snoozed: 1,
      createdAt: 1,
      updatedAt: 1,
      messages: 1,
      participantDetails: 1,
    },
  },
];
