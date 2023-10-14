
//_____________________________________<<  PODCAST SECTION >>___________________________________
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

require("dotenv").config();
const express = require("express");
const route = express.Router();
const db = require("../config/mongo-config");
const { podcastModel } = require("../db/schema");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { UploadSrc, ParticularPodcast, ListAllPodcast, RegenerateUrlAllPodcast, updatePodcast, DeletePodcast, Disbanpodcast, Banpodcast } = require('../storage.config/s3');
const redis = require('redis');
const { starterQueue } = require("../queue/queue");
const redisClient = redis.createClient({
    url: "redis://cache.akarahub.tech:6379"
});
(async () => await redisClient.connect())();
redisClient.on('ready', () => console.log("<< ----👌|= Connection to cache is completed ✔ ")); redisClientCache.on('ready', () => console.log("connect to cache3 successfully")); redisClient.on('ready', () => console.log("==>>> connect to queue server complete"));
redisClient.on('error', (err) => console.log("<< ---🤢 |= The connection to the cache has been raised error 💥")); redisClientCache.on('error', (err) => console.log("error during connecting to redis server ...")); redisClient.on('error', (err) => console.log("==>>> error during connecting to redis server ..."));
const { redisClientCache } = require('../config/redis-config');
db();

//_____________________________________________________
//👇  UPLOAD PODCAST
//---
route.post("/upload/podcast", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), async (req, res) => {
    const user = req.user;      // user of the user who upload the podcast
    const role = req.role;       // role of the user who upload the podcast
    const email = req.email;    // email of the user who upload the podcast
    const result = await UploadSrc(req.body, user, role, email, () => require('crypto').randomBytes(32).toString('hex'), req.files['image'][0].buffer, req.body.image_type
        , req.files['audio'][0].buffer, req.body.audio_type);
    // upload success response back to the user
    return res.json({
        error: false,
        message: result,
        data: null
    })
});

//______________________________________________________________
// 👇 LIST ALL PODCAST
//---
route.get("/list/listallpodcast", async (req, res) => {
    // check if the data of all podcast is available in redis cache 
    const data = await redisClientCache.get("podcast");
    if (data != null) {
        // if data is available in the cache get it and send it right away to the client  
        return res.json({
            error: false,
            message: "Your request is accepted , you are sent the data",
            data: JSON.parse(data)
        })
    } else {
        // get the data back from the database
        const result = await ListAllPodcast()
        // afer get the data from the database please set it the redis cache
        redisClientCache.setEx("podcast", 60, JSON.stringify(result));
        return res.json({
            error: false,
            message: "Your request is accepted , you are sent the data",
            data: result
        })
    }
})
// ________________________________________________________________
// 👇 list a particular podcast
// ---
route.post("/list/podcast", async (req, res) => {
    // // get podcast id 
    const podcast_id = req.body.podcast_id;
    if (podcast_id != null || podcast_id != "") {
        const result = await ParticularPodcast(podcast_id);
        return res.json(result);
    } else {
        return res.json({
            error: true,
            message: "PLease check your podcast id again.",
            data: {}
        });
    }
})
// __________________________________________________________
// 👇 UPDATE PODCAST
// ---
route.post('/update/podcast', upload.fields([{ name: 'file_image', maxCount: 1 }, { name: 'file_audio', maxCount: 1 }]), async (req, res) => {
    // get the podcast update 
    const podcast_id = req.body.podcast_id;
    const title = req.body.title;
    const category = req.body.category;
    const composer = req.body.composer;
    const description = req.body.description;
    const image_type = req.body.image_type;
    const audio_type = req.body.sound_type;
    const file_image = req.files['file_image'];
    const file_audio = req.files['file_audio'];
    // check if the user update image or audio or just the text
    const result = await updatePodcast(() => require('crypto').randomBytes(32).toString('hex'), podcast_id, title, category, description, composer, file_image, file_audio, image_type, audio_type);
    return res.json({
        error: false,
        message: result
    })
})
// __________________________________________________________
//👇 DELETE PODCAST
// ---
route.post('/delete/podcast', async (req, res) => {
    // getting the id from the client 
    const podcast_id = req.body.podcast_id;
    console.log(req.body);
    const data = await podcastModel.findOne({ _id: podcast_id });
    if (data) {
        const result = await DeletePodcast(data._id);
        return res.json({
            error: false,
            message: result,
            data: null
        })
    } else {
        return res.json({
            error: false,
            message: "this podcast might have already deleted from the system.",
            data: null
        })
    }

})
// ________________________________________________________________
// 👇BAN PODCAS
// ---
route.post('/ban/banpodcast', async (req, res) => {
    const podcast_id = req.body.podcast_id;
    const result = await Banpodcast(podcast_id);
    return res.json({
        error: false,
        message: result,
        data: null
    })
});
// ________________________________________________________
//👇 DISBAN PODCAST 
// ---
route.post('/ban/notban', async (req, res) => {
    const podcast_id = req.body.podcast_id;
    console.log(req.body);
    const result = await Disbanpodcast(podcast_id);
    return res.json({
        error: false,
        message: result,
        data: null
    })
});
// ________________________________________________________
//👇 REGENERATE PODCAST URL EVERY GIVEN TIME
// ---
let stopeQueueRegenerateUrl = null;
let time = 1000 * 60; // regenerate every one minute
route.post('/regenerate/podcast/forever', async (req, res) => {
    //define the timeInterval for each task to be executed
    stopeQueueRegenerateUrl = setInterval(() => {
        // call bull task and put your task in that queue
        starterQueue(RegenerateUrlAllPodcast());
        redisClient.flushAll();
    }, time);
    return res.json({
        error: false,
        message: "Well, the task is being scheduled to be executed by redis queue in every 1 hours , and start from the time you request",
        data: null
    })
});
// _____________________________________________________
//👇 STOP REGENERATE URL PROCESS
// ---
route.post('/stop/regenerate/podcast', (req, res) => {
    // clear cheduled task from memory
    clearInterval(stopeQueueRegenerateUrl);
    return res.json({
        error: false,
        message: "Well, the task is being scheduled to be executed by redis queue is now completely stopped , and start from the time you request",
        data: null
    })
})

//___________________________________________________
// EXPORT 
module.exports = route;