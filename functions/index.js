const functions = require('firebase-functions');
require('dotenv').config();
const moment = require('moment');
const admin = require('firebase-admin');
const Quotes = require('./quotes');
admin.initializeApp();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

let n = Math.floor(Math.random() * Math.floor(Quotes.length));
let author = Quotes[n].author;
let quote = Quotes[n].quote;

const generatePackage = (package) => {
	{
		referral.package &&
			referral.package.internet &&
			referral.package.internet.name + ', ';
	}
	{
		referral.package && referral.package.tv && referral.package.tv.name + ', ';
	}
	{
		referral.package && referral.package.home && referral.package.home.name;
	}
	if (!package) {
		return null;
	}
	const i = package && package.internet ? package.internet.name : '';
	const tv = package && package.tv ? package.tv.name : '';
	const ph = package && package.home ? package.home.name : '';
	const wireless = package && package.wireless ? package.wireless.name : '';

	const final = i + ' ' + tv + ' ' + ph + ' ' + wireless;

	return final;
};

exports.onReferralClosed = functions.firestore
	.document('/referrals/{userId}/referrals/{referralId}')
	.onUpdate(async (change, context) => {
		try {
			const previousData = change.before.data();
			const referral = change.after.data();
			const user = (
				await admin.firestore().collection('users').doc(referral.userId).get()
			).data();

			const {
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
				name,
				order_date,
			} = referral;
			const sendTo = [referee.email];
			const ccTo = [user.coachInfo.email, manager.email, user.email];

			if (referral.status.name === 'Closed' && !referral.email_sent) {
				const congrat = await sgMail.send({
					to: sendTo,
					from: user.email,
					cc: ccTo,
					subject: `Congratulations ${referee.name.split(' ')[0]}`,
					html: `<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8">
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<meta http-equiv="X-UA-Compatible" content="ie=edge">
							<title>Referral Notification</title>
						   <style>
							   .container {
							width: 95%;
							margin: 0 auto;
							position: relative;
							background-color: rgb(248, 245, 240);
							height: 100%;
							-webkit-box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);
						-moz-box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);
						box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);
						}
						body {
							font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
							margin: 0;
							padding: 0;
						}
						.center {
							text-align: center
						}
						.mt-3 {
							margin-top: 3px;
						}
						.mx-auto  {
							margin: 5px;
						}
						.p {
							font-style: italic;
							opacity: 0.7;
							font-size: 1.2rem;;
						}
						.heading {
							font-size: 1.7rem;
							padding-top: 2rem;
						}
						.main-body {
							min-width: 100%;
							max-width: 100%;
							min-height: 100%;
						}
						.sub-heading    {
							font-size: 1.6rem;
							padding: 5px;
							
						}
						ul {
							position: relative;
							margin: 0 auto;
							list-style: none;
						 
						}
						ul li {
							text-decoration-style: none;
							margin: 1rem;
							padding: 10px;
							font-weight: 500;
						}
						ul li span {
							margin-left: 10px;
							text-transform: capitalize;
							font-style: italic
						}
						.closing {
							margin-top: 20px;
							padding-top: 10px;
							font-size: 1.3rem;
							font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
							font-style: italic;
							max-width: 90%;
						}
						.closing i {
							text-align: right;
							font-size: 0.9rem;
							float: right;
						}
						   </style>
						</head>
						<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;margin: 0;padding: 0;">
							<div class="container" style="width: 95%;margin: 0 auto;position: relative;background-color: rgb(248, 245, 240);height: 100%;-webkit-box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);-moz-box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);box-shadow: 10px 10px 7px 0px rgba(138,138,138,0.43);">
								<h3 class="center heading" style="text-align: center;font-size: 1.7rem;padding-top: 2rem;">Congratulations <span style="text-transform: capitalize;">${
									referee.name.split(' ')[0]
								}</span> this referral has been closed.</h3>
								<p class="center p" style="text-align: center;font-style: italic;opacity: 0.7;font-size: 1.2rem;">You should be getting your points shortly, keep them coming!</p>
								<div class="main-body" style="min-width: 100%;max-width: 100%;min-height: 100%;">
									<h4 class="center sub-heading" style="text-align: center;font-size: 1.6rem;padding: 5px;">Here are the details</h4>
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
									<div class="closing" style="margin-top: 20px;padding-top: 10px;font-size: 1.1rem;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;font-style: italic;max-width: 90%;">
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

				await admin
					.firestore()
					.collection('referrals')
					.doc(referral.userId)
					.collection('referrals')
					.doc(referral.id)
					.update({ email_sent: true });
				const { statusCode, body } = await congrat[0];

				if (statusCode >= 200 && statusCode < 300) {
					await sgMail.send({
						to: [manager.email],
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
								<div class="card" style="-webkit-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);-moz-box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);box-shadow: 13px 11px 5px -1px rgba(0, 0, 0, 0.3);background: #fff;">
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
					});
				}
			}
		} catch (error) {
			console.log('Error', error);
		}
	});
