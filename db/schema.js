
const { required } = require("joi");
const schema = require("mongoose");
const uuid = require("node-uuid");
//========================================
//--- PODCAST SCHEMA
//----
const podcastSchema = new schema.Schema({
    _id: {
        type: String,
        default: uuid.v1
    },
    podcastCategoryName: {
        type: String,
        required: true
    },
    podcastCategoryId: {
        type: String,
        default: null
    },
    owner: {
        type: String,
        default: "Anonymous"
    }
    ,
    podcastTitle: {
        type: String,
        required: true
    },
    podcasterId: {
        type: String,
        required: true
    },
    audioName: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    podcastUrl: {
        type: String,
        defautl: null
    },
    imageUrl: {
        type: String,
        default: null
    },
    podcastDescription: {
        type: String,
        default: "Akara podcast."
    },
    ban: {
        type: String,
        default: "Disbanned"
    }
    ,
    viewed: {
        type: Number,
        default: 0
    },
    favourite: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
    versionKey: false
});

//========================================
//--- CATEGORY SCHEMA
//----

const categorySchema = new schema.Schema({
    _id: {
        type: String,
        default: uuid.v1
    },
    categoryType: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });
//========================================
//--- PODCASTER CATEGORY SCHEMA
//----
const podcasterCategorySchema = new schema.Schema({
    _id: {
        type: String,
        default: uuid.v1
    },
    podcasterId: {
        type: String,
    },
    podcastCategoryId: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });

//========================================
//--- SIGN UP SCHEMA
//----
const signUpSchema = new schema.Schema({
    _id: {
        type: String,
        default: function getUUID() {
            return uuid.v1()
        }
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirm: {
        type: String,
        required: true
    },
    role: {
        type: [String],
        enum: ["user", "podcaster", "admin", "super_admin"],
        default: ["user"]
    },
    ban: {
        type: String,
        default: "no banned"
    }
    ,
    personal_secret: {
        type: String,
        default: null
    },
    accessToken: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true, versionKey: false });
//========================================
//--- PODCASTER PROFILE SCHEMA
//----
const podcasterProfileSchema = new schema.Schema({
    _id: {
        type: String,
        default: uuid.v1
    },
    podcasterId: {
        type: String,
    },
    profileName: {
        type: String,
        required: true
    },
    profileUrl: {
        type: String,
        default: null
    }
}, { timestamps: true, versionKey: false });
//==========================================<< MODELS >>=======================================
//_____________________________________________________________________________________________

const signUpModel = schema.model("signUpModel", signUpSchema);
const podcastModel = schema.model("podcastModel", podcastSchema);
const categoryModel = schema.model("categoryModel", categorySchema);
const podcasterCategoryModel = schema.model("podcasterCategoryModel", podcasterCategorySchema);
const podcasterProfileModel = schema.model("podcasterProfileModel", podcasterProfileSchema);
//______________________________________________________________________________________________
// EXPORT MODELS
module.exports = { podcastModel, categoryModel, podcasterCategoryModel, signUpModel, podcasterProfileModel };