# classy-test-data
Create Classy records for testing in bulk

## What it does
* Set start and end date for the campaign
* Create a set number of teams
* Create a random number of pages per team
* Create a random number of donations per page, each with a random amount.

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
