const nodemailer = require('nodemailer');
const CronJob = require('cron').CronJob;
const kue = require('kue')
const queue = kue.createQueue()
let methods = {}

function sendEmail(data, done){
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // secure:true for port 465, secure:false for port 587
      auth: {
          user: 'otwketemu@gmail.com',
          pass: 'otwketemu17'
      }
  });

  // send mail with defined transport object
  transporter.sendMail(data, function (error, info){
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });

  done()
}

methods.firstCreateMeetup = (record) => {
  // console.log('USER: ', record)

  let date = new Date(record.createdDate)
  let s = date.getMinutes()
  let h = date.getHours()
  let d = date.getDate()
  let m = date.getMonth()
  let e = date.getDay()

  // console.log('1. getMinutes: ', s)
  // console.log('2. getHours: ', h)
  // console.log('3. getDate: ', d)
  // console.log('4. getMonth: ', m)
  // console.log('5. getDay: ', e)

  new CronJob(`00 ${s+1} ${h} ${d} ${m} ${e}`, function() {

    let recordEmail = []
      record.participants.map(participant => {
        recordEmail.push(participant.user.email)
      })

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"${record.creator.name} 👻" <otwketemu@gmail.com>`,
        to: ''+recordEmail,
        subject: `${record.title} ✔`,
        text: `Test`,
        html: `<b>${record.creator.name} invites you to join in meetup: <br>Title: ${record.title}, <br>Description: ${record.description}. <br>Please accept the invitation.</b>`
    }

    var job = queue.create('email', mailOptions).save( function(err){
       if( !err ) console.log( job.id );
      //  console.log('CREATE EMAIL!!!!');
    });

  }, null, true, 'Asia/Jakarta');

  queue.process('email', function(job, done){
    sendEmail(job.data, done);
    // console.log('CALL FUNCTION SENDEMAIL!!!!');
  });

}

methods.confirmationTime = (record) => {
  // console.log('USER: ', record)

  let date = new Date(record.confirmationTime)
  let s = date.getMinutes()
  let h = date.getHours()
  let d = date.getDate()
  let m = date.getMonth()
  let e = date.getDay()

  // console.log('1. getMinutes: ', s)
  // console.log('2. getHours: ', h)
  // console.log('3. getDate: ', d)
  // console.log('4. getMonth: ', m)
  // console.log('5. getDay: ', e)

  new CronJob(`00 ${s} ${h-1} ${d} ${m} ${e}`, function() {

    let recordEmail = []
      record.participants.map(participant => {
        recordEmail.push(participant.user.email)
      })

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"${record.creator.name} 👻" <otwketemu@gmail.com>`,
        to: ''+recordEmail,
        subject: `${record.title} ✔`,
        text: `Test`,
        html: `<b>${record.creator.name} invites you to join in meetup: <br>Title: ${record.title}, <br>Description: ${record.description}. <br>Please accept the invitation.</b>`
    }

    var job = queue.create('email', mailOptions).save( function(err){
       if( !err ) console.log( job.id );
    });

  }, null, true, 'Asia/Jakarta');

  queue.process('email', function(job, done){
    sendEmail(job.data, done);
  });
}

module.exports = methods