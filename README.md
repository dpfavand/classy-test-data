# classy-test-data
Create [Classy](https://github.com/classy-org/) records for testing in bulk

## What it does
* Set start and end date for the campaign
* Create a set number of teams
* Create a random number of pages per team up to the defined maximum
* Create a random number of donations per page up to the defined maximum, each with a random amount.

## What it doesn't do
* This can't set created\_at dates for fundraisers and teams because those cannot be manipulated through the Classy API. However it does set started\_at and ended\_at for the fundraising pages, and purchased\_at for offline donations.

## Setup

Create a `.env` file with the following:

```
CLIENT_ID=
CLIENT_SECRET=
EMAIL_PREFIX=test
EMAIL_SUFFIX=@example.com
```

The email prefix and suffix are used to generate individual email addresses such as test+team1page1@example.com

Tweak data.json by setting your org and target campaign ID, and adjusting other parameters.
