const Meetup = require('../models/meetup')
let methods = {}

methods.createMeetup = (req, res) => {
    let newMeetup = new Meetup({
        title: req.body.title,
        description: req.body.description,
        meetingTime: req.body.meetingTime,
        confirmationTime: req.body.confirmationTime,
        typePlaces: req.body.typePlaces,
        placeAddressName: req.body.placeAddressName,
        placeAddressGeolocation: req.body.placeAddressGeolocation,
        creator: req.body.creator,
        participants: req.body.participants,
        location60: [],
        location30: [],
        location15: []
    })

    newMeetup.save((err, data) => {
        if (err) res.json({err})

        Meetup.findById(data._id)
        .populate('creator participants.user')
        .exec((err, record) => {
            if (err) res.json({err})
            res.json(record)
        })
    })
} //createMeetup

methods.getAllMeetup = (req, res) => {
    Meetup.find({})
    .populate('creator participants.user')
    .exec((err, records) => {
        if (err) res.json({err})
        res.json(records)
    })
} // getAllMeetup

methods.getDetailMeetup = (req, res) => {
    Meetup.findById(req.params.id)
    .populate('creator participants.user')
    .exec((err, record) => {
        if (err) res.json({err})
        res.json(record)
    })
} //getDetailMeetup

methods.editMeetup = (req, res) => {
    Meetup.findById(req.params.id)
    .exec((error, response) => {
        if (error) res.json({error})

        Meetup.findByIdAndUpdate({
            "_id": response._id
        }, {
            $set: {
                title: req.body.title || response.title,
                description: req.body.description || response.description,
                meetingTime: req.body.meetingTime || response.meetingTime,
                confirmationTime: req.body.confirmationTime || response.confirmationTime,
                typePlaces: req.body.typePlaces || response.typePlaces,
                placeAddressName: req.body.placeAddressName || response.placeAddressName,
                placeAddressGeolocation: req.body.placeAddressGeolocation || response.placeAddressGeolocation,
                participants: req.body.participants || response.participants,
                status: req.body.status || response.status,
                location60: req.body.location60 || response.location60,
                location30: req.body.location30 || response.location30,
                location15: req.body.location15 || response.location15
            }
        }, {
            new: true
        })
        .exec((err, result) => {
            if (err) res.json({err})

            Meetup.findById(result._id)
            .populate('creator participants.user')
            .exec((error, record) => {
                if (error) res.json({error})
                res.json(record)
            })
        })
    })
} //editMeetup

methods.updateParticipants = (req, res) => {
    Meetup.findById(req.params.id)
    .populate('creator participants.user')
    .exec((err, record) => {
        if (err) res.json({err})
        record.participants.push(req.body.participants)
        record.save(err => {
            Meetup.findById(req.params.id)
                .populate('creator participants.user')
                .exec((err, record) => {
                    if (err) res.json({err})
                    res.json(record)
                })
        })
    })
} //editParticipants

methods.cancelMeetup = (req, res) => {
    Meetup.findById(req.params.id)
    .populate('creator participants.user')
    .exec((err, record) => {
        if (err) res.json({err})
        record.participants = record.participants.filter(participant => participant._id != req.body.participantId)
        record.save((error, data) => {
            res.send(data)
        })
    })
} //cancelMeetup

methods.finalizeMeetup = (req, res) => {
    Meetup.findById(req.params.id)
    .populate('creator participants.user')
    .exec((err, record) => {
        if (err) res.json({err})
        record.status = 'upcoming'
        record.save((error, data) => {
            if (error) res.json({error})
            res.json(data)
        })
    })
} //finalizeMeetup

methods.deleteMeetupById = (req, res) => {
    Meetup.findByIdAndRemove(req.params.id, (err, record) => {
        if (err) res.json({err})

        res.json(record)
    })
} //deleteMeetup

module.exports = methods