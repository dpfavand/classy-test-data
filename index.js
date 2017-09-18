const Classy = require('classy-node');
require('dotenv').config();
const colors = require('colors');
const data = require('./data.json');
const DateGenerator = require('random-date-generator');
const startDate = new Date(data.started_at);
const endDate = new Date(data.ended_at);

const classy = new Classy({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    // requestDebug: false,
});

const emailPrefix = process.env.EMAIL_PREFIX;
const emailSuffix = process.env.EMAIL_SUFFIX;

function getRandomIntInclusive(min, max) { // Public Domain https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

console.clear();
console.log('Created classy'.green);

const app = classy.app();

// set the campaign start/end date
app.then(aResult => {
    console.log('Setting campaign start + end date'.yellow)
    return classy.campaigns.update(data.campaign, 
        { token: 'app', started_at: data.started_at, ended_at: data.ended_at
        });
}).then(cResponse => {
    console.log('campaign update OK'.green);
    console.log(`Start date: ${cResponse.started_at}`);
    console.log(`End date: ${cResponse.ended_at}`);
});

// create teams, team pages, donations to those team pages
app.then(aResult => {
    console.log('Creating teams...'.yellow);
    for (var index = 0; index < data.teams_count; index++) { // create teams!
        console.log(`Creating team ${index}`.yellow);
        classy.campaigns.createFundraisingTeam(data.campaign, {
            token: 'app',
            name: `Test Team ${index}`,
            // irrelevant - not in Classy API started_at: DateGenerator.getRandomDateInRange(startDate, endDate).toISOString(),
            // ended_at: data.ended_at
        }).then(tResult => {
            for (var pageI = 0; pageI < getRandomIntInclusive(1, data.max_pages_per_team); pageI ++) { // create members+pages!
                console.log(`Creating member ${tResult.name} - ${pageI}`.yellow);
                classy.organizations.createUnclaimedAccount(data.org, {
                    token: 'app',
                    email_address: `${emailPrefix}+team${tResult.id}-page${pageI}${emailSuffix}`,
                    first_name: `page${pageI}`,
                    last_name: `team${tResult.id}`
                }).then(mResult => {
                    console.log(`Creating page ${tResult.name} - ${pageI}`.yellow);
                    return classy.fundraisingTeams.createFundraisingPage(tResult.id, {
                        token: 'app',
                        title: `Test Page for Team ${tResult.id} - Page ${pageI}`,
                        member_id: mResult.id,
                        started_at: DateGenerator.getRandomDateInRange(startDate, endDate).toISOString().split('.')[0]+"Z", // remove miliseconds Classy API doesn't like
                        // started_at: "2016-02-01T00:37:23Z",
                        ended_at: data.ended_at
                    });
                }).then(pResult => {
                    for (var donationI = 0; donationI < getRandomIntInclusive(1, data.max_donations_per_page); donationI++ ) { // create donations!
                        console.log(`Creating donation TEAM ${tResult.name}, PAGE ${pResult.title}, DONATION ${donationI}`.yellow);
                        var dDate = DateGenerator.getRandomDateInRange(new Date(pResult.started_at), endDate).getTime();
                        dDate -= dDate % 1000;
                        classy.campaigns.createTransaction(data.campaign, {
                            token: 'app',
                            billing_first_name: `team${tResult.id}page${pResult.id}`,
                            billing_last_name: 'TestDonor',
                            fundraising_page_id: pResult.id,
                            purchased_at: new Date(dDate).toISOString().split('.')[0]+"Z",
                            items: [
                                {
                                    product_price: getRandomIntInclusive(5, data.max_donation_amount),
                                    type: "offline_donation"
                                }
                            ]
                        }).catch(err => {
                            console.log("ERROR -- DONATION LOOP".red);
                            console.log(err);
                        })
                    }
                }).catch(err => {
                    console.log("ERROR -- SUPPORTER OR PAGE".red);
                    console.log(err);
                })
                
            }
        }).catch(err => {
            console.log("ERROR -- TEAM".red);
            console.log(err);
        })
    }
}).catch(err => {
    console.log("ERROR -- TOP LEVEL".red);
    console.log(err);
})



