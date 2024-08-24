const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
    content: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: String, 
        required: false
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    comments: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Comment' 
    }], // Ahora referencia los comentarios por ObjectId
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model("Post", postSchema);
