const mongoose = require("mongoose");

const DecisionSchema = new mongoose.Schema({
  decisionText: {
    type: String,
    required: true
  },
  decisionCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  decisionCreatorUsername: String,
  voteOver: {
    type: Boolean,
    default: false
  },
  answers: [
    {
      answerText: {
        type: String,
        required: true
      },
      upVotes: [String],
      downVotes: [String]
    }
  ],
  maxVotes: {
    type: Number,
    default: 1
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now
  },
  currentLoggedInUserId: {
    type: String,
    default: ""
  },
  totalVotesPerUser: [
    {
      userName: {
        type: String,
        required: true
      },
      type: Number,
      required: true,
      default: 0
    }
  ]
});

const DecisionModel = mongoose.model("Decision", DecisionSchema);
module.exports = DecisionModel;
