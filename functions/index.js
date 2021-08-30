const functions = require('firebase-functions');
require('dotenv').config();
const moment = require('moment');
const admin = require('firebase-admin');
const Quotes = require('./quotes');
admin.initializeApp();
// const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const transporter = require('nodemailer-sendgrid-transport');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const client = nodemailer.createTransport(
	transporter({ auth: { api_key: process.env.SENDGRID_API_KEY } })
);

let n = Math.floor(Math.random() * Math.floor(Quotes.length));
let author = Quotes[n].author;
let quote = Quotes[n].quote;

exports.onReferralClosed = functions.firestore
	.document('referrals/{userId}/referrals/{referralId}')
	.onUpdate(async (change, context) => {
		const eventId = context.eventId;
		const emailRef = admin.firestore().collection('sentEmails').doc(eventId);

		const wasAlreadySent =
			(await emailRef.get()).exists || (await emailRef.get().sent);
		if (wasAlreadySent) return;
		const referral = change.after.data();
		const oldReferral = change.before.data();
		try {
			const {
				id,
				userId,
				referee,
				manager,
				address,
				apt,
				moveIn,
				email,
				phone,
				mon,
				package,
				due_date,
				status,
				name,
				order_date,
				comment,
			} = referral;

			if (status.name === oldReferral.status.name && oldReferral.mon) {
				return;
			}

			const user = (
				await admin.firestore().collection('users').doc(userId).get()
			).data();

			const sendTo = [referee.email];
			const ccTo = [user.coachInfo.email, manager.email, user.email];

			const generatePackage = (package) => {
				{
					package && package.internet && package.internet.name + ', ';
				}
				{
					package && package.tv && package.tv.name + ', ';
				}
				{
					package && package.home && package.home.name;
				}
				if (!package) {
					return null;
				}
				const i = package && package.internet ? package.internet.name : '';
				const tv = package && package.tv ? package.tv.name : '';
				const ph = package && package.home ? package.home.name : '';
				const wireless =
					package && package.wireless ? package.wireless.name : '';

				const final = i + ' ' + tv + ' ' + ph + ' ' + wireless;

				return final;
			};

			if (status.name === 'Closed') {
				return client
					.sendMail({
						to: [manager.email],
						from: { name: user.name, address: user.email },
						cc: [user.coachInfo.email, user.email],
						subject: 'Referral / Sale Closed Notificiation',
						html: `  <!DOCTYPE html>
								<html lang="en">
								<head>
									<meta charset="UTF-8">
									<meta name="viewport" content="width=device-width, initial-scale=1.0">
									<meta http-equiv="X-UA-Compatible" content="ie=edge">
									 <!--Import Google Icon Font-->
									  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
										<!--Import materialize.css-->
		
										 <!--Let browser know website is optimized for mobile-->
										<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
									<title></title>
								</head>
								<body>
								<div class="container" style="margin: 0 auto;width: 100%;">
									<div class="card" style="-webkit-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);border-radius: 10px; -moz-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);background: #fff;">
										<div class="card-title">
											<h3 class="center" style="text-align: center;font-family: sans-serif;font-size: 1.7rem;text-transform: capitalize;">This referral has been closed</h3>
											<div class="main_body" style="padding: 1rem;background: rgba(248, 246, 246, 0.541);">
												<h2 class="center pd" style="text-align: center;padding: 10px; text-transform: capitalize;">${name}</h2>
												<ul style="margin: 0 auto;">
													<li style="text-decoration: none;list-style: none;padding: 0.8rem; text-transform: uppercase; margin: 0 auto;font-weight: bolder;">MON: ${mon}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Due Date: ${moment(
														due_date
													).format('L')}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Date Placed: ${moment(
														order_date
													).format('L')}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Address: ${address}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;text-transform: uppercase;">Apt: ${
														apt ? apt : 'none'
													}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Package: ${generatePackage(
														package
													)}</li>
		
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Phone: ${phone}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Email: ${
														email ? email : ''
													}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto;">Move In: ${moment(
														moveIn
													).format('L')}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Referred By: ${
														referee.name
													}</li>
													<li style="text-decoration: none;list-style: none;padding: 0.8rem;margin: 0 auto; text-transform: capitalize;">Status: ${
														status.name
													}</li>
												</ul>
		
											</div>
											<div class="comment card" style="-webkit-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);-moz-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);background: rgb(158, 158, 158);padding: 1rem;">
												<h3>Comments or Notes:</h3>
												<p style="text-align: left;font-size: 1.1rem;padding: 10px;line-height: 1.5;">
												${comment ? comment : ''}
													</p>
											</div>
										</div>
		
									</div>
								</div>
		
							</body>
								</html>
								`,
					})
					.then((respond) => {
						return client.sendMail({
							to: sendTo,
							from: { name: user.name, address: user.email },
							cc: ccTo,
							subject: `Congratulations ${referee.name.split(' ')[0]}`,
							html: `<!DOCTYPE html>
							<html lang="en">
							<head>
								<meta charset="UTF-8">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
								<meta http-equiv="X-UA-Compatible" content="ie=edge">
								<title>Referral Notification</title>
						
							</head>
							<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;margin: 0;padding: 0;">
								<div class="container" style="width: 95%;margin: 0 auto;position: relative;background-color: rgb(228, 225, 220);height: 100%;-webkit-box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);margin-bottom: 20px;border-radius: 10px; -moz-box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);">
									<h3 class="center heading" style="text-align: center;font-size: 1.7rem;padding-top: 2rem;">Congratulations <span style="text-transform: capitalize;">${
										referee.name.split(' ')[0]
									}</span> this referral has been closed.</h3>
									<p class="center p" style="text-align: center;font-style: italic;opacity: 0.7;font-size: 1.2rem;">You should be getting your points shortly, keep them coming!</p>
									<div style="display:flex; align-items:center;justify-content: center;flex-direction:column">
										<h3 >Have another referral to enter?</h3>
									<a style="text-decoration: none;border-radius: 15px;padding: 18px 35px;background-color:rgb(53, 45, 45);font-weight: 600;cursor: pointer;color: rgb(255, 255, 255);" target="_blank" href="https://verizonfiosrewards.com/">Enter Referral</a>
									</div>
									<br>
									<div style="height: 2px;width: 90%;background-color: lightgrey;opacity: 0.7;margin: 0 auto;"></div>
									
									<div class="main-body" style="min-width: 100%;max-width: 100%;min-height: 100%;">
										<h4 class="center sub-heading" style="text-align: center;font-size: 1.6rem;padding: 5px;margin-bottom: 25px;">Here are the details</h4>
										<ul style="position: relative;margin: 0 auto;list-style: none;">
											<li style="text-decoration-style: none;margin: 1rem;padding: 10px;font-weight: 500;">Name: <span style="margin-left: 10px;text-transform: capitalize;font-style: italic;">${name}</span></li>
											<li style="text-decoration-style: none;margin: 1rem;padding: 10px;font-weight: 500;">Address: <span style="margin-left: 10px;text-transform: capitalize;font-style: italic;">${address}</span></li>
											<li style="text-decoration-style: none;margin: 1rem;padding: 10px;font-weight: 500;">Apt: <span style="margin-left: 10px;text-transform: capitalize;font-style: italic;"></span>${apt}</li>
											<li style="text-decoration-style: none;margin: 1rem;padding: 10px;font-weight: 500;">Move In: <span style="margin-left: 10px;text-transform: capitalize;font-style: italic;"></span>${moment(
												moveIn
											).format('L')}</li>
											<li style="text-decoration-style: none;margin: 1rem;padding: 10px;font-weight: 500;">Phone: <span style="margin-left: 10px;text-transform: capitalize;font-style: italic;"></span>${phone}</li>
											<li style="text-decoration-style: none;margin: 1rem;padding: 10px;font-weight: 500;">Email: <span style="margin-left: 10px;text-transform: capitalize;font-style: italic;"></span>${
												email ? email : 'none'
											}</li>
											<li style="text-decoration-style: none;margin: 1rem;padding: 10px;font-weight: 500;">Date Closed: <span style="margin-left: 10px;text-transform: capitalize;font-style: italic;"></span>${moment(
												order_date
											).format('L')}</li>
										</ul>
										<div class="closing" style="margin-top: 20px;padding-top: 10px;border-radius: 10px; font-size: 1.1rem;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;font-style: italic;max-width: 90%;">
												<blockquote class="center" style="text-align: center;"> 
														"${quote}”
													   
												</blockquote>
												<i style="text-align: right;font-size: 0.9rem;float: right;">${author}</i>
											</div>
									</div>
								   
								</div>
								
							</body>
							</html>
									`,
						});
					})
					.then((data) => {
						return emailRef.set({ sent: true });
					})
					.catch((err) => console.log('ER', err));
			}
		} catch (error) {
			console.log('Error', error.message);
			return;
		}
	});

function shouldSend(emailRef) {
	return emailRef.get().then((emailDoc) => {
		return !emailDoc.exists || !emailDoc.data().sent;
	});
}

function markSent(emailRef) {
	return emailRef.set({ sent: true });
}
