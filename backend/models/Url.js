const { Schema, model } = require('mongoose');

const clickSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now
    },
    userAgent: String,
    ipAddress: String,
    referer: String,
    device: String,
    browser: String,
    os: String
}, { _id: false });

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: true
    },
    urlCode: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    clickDetails: [clickSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Url', urlSchema); 