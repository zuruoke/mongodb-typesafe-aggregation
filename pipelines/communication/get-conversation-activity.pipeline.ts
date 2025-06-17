import { PipelineStage } from 'mongoose';


export const getConversationActivityPipeline = (
  searchText?: string,
): PipelineStage[] => [
  {
    $unwind: {
      path: '$participantIds',
      preserveNullAndEmptyArrays: false,
    },
  },
  {
    $group: {
      _id: '$participantIds',
      conversations: { $push: '$$ROOT' },
      updatedAt: { $max: '$updatedAt' },
      createdAt: { $first: '$createdAt' },
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAMES.USERS,
      let: { participantId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: '$$participantId' }],
            },
          },
        },
      ],
      as: 'user',
    },
  },
  {
    $addFields: {
      participantName: {
        $concat: [
          { $arrayElemAt: ['$user.firstName', 0] },
          ' ',
          { $arrayElemAt: ['$user.lastName', 0] },
        ],
      },
    },
  },
  ...(searchText
    ? [
        {
          $match: {
            participantName: { $regex: searchText, $options: 'i' },
          },
        },
      ]
    : []),
  {
    $addFields: {
      updatedAt: { $max: '$conversations.updatedAt' },
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAMES.MESSAGES,
      let: { conversationIds: '$conversations._id' },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ['$conversationId', '$$conversationIds'],
            },
          },
        },
        {
          $facet: {
            latestMessage: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
            pendingMessages: [
              {
                $match: {
                  $expr: { $eq: ['$status', MessageStatus.PENDING] },
                },
              },
            ],
          },
        },
      ],
      as: 'messageData',
    },
  },
  {
    $addFields: {
      pendingMessageCount: {
        $size: { $arrayElemAt: ['$messageData.pendingMessages', 0] },
      },
      latestMessage: {
        $cond: {
          if: {
            $gt: [
              { $size: { $arrayElemAt: ['$messageData.latestMessage', 0] } },
              0,
            ],
          },
          then: {
            $arrayElemAt: [
              { $arrayElemAt: ['$messageData.latestMessage', 0] },
              0,
            ],
          },
          else: null,
        },
      },
    },
  },
  {
    $lookup: {
      from: COLLECTION_NAMES.UNITS,
      let: {
        unitIds: {
          $reduce: {
            input: '$conversations',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this.associatedUnitIds'] },
          },
        },
      },
      pipeline: [
        {
          $match: {
            $expr: { $in: ['$_id', '$$unitIds'] },
          },
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.PROPERTIES,
            localField: 'propertyId',
            foreignField: '_id',
            as: 'property',
          },
        },
        {
          $lookup: {
            from: COLLECTION_NAMES.ADDRESS,
            localField: 'addressId',
            foreignField: '_id',
            as: 'address',
          },
        },
      ],
      as: 'associatedUnits',
    },
  },
  {
    $project: {
      _id: 0,
      participantId: '$_id',
      participantName: 1,
      conversationType: 1,
      officeId: 1,
      snoozed: 1,
      pendingMessageCount: 1,
      latestMessage: 1,
      updatedAt: 1,
      createdAt: 1,
      associatedUnits: 1,
      conversationId: { $arrayElemAt: ['$conversations._id', 0] },
    },
  },
];
