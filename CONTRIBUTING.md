# Contributing to 7 days to die sever manager

## Thanks for taking the time to contribute
The following is a set of guidelines for contributing to 7 days to die sever manager. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Links to some resources

You can join the [Discord server](http://catalysm.net/discord) to directly communicate with the developers.

You can find all information about the [CSMM](https://docs.csmm.app/) here.

Please go through the [installation guide](https://docs.csmm.app/en/CSMM/self-host/installation.html) to setup your environment.



## Code of Conduct for Contributors
This project and everyone participating in it is governed by the code of conduct for contributors which you can find [here](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How can I contribute?
1. You can report bugs/glitches/faults that you are likely to come across when using the project server and client apps.
2. You can suggest enhancements that you would want to see implemented on the project by creating an issue.
3. You can address a wide variety of open issues if you wish to contribute using your code and make a pull request.

## Steps to contribute

* Comment on the issue you want to work on. Make sure it's not assigned to someone else. For new comers to open-source, you can pick the issue having 'good first issue' tag.

* If you think you encounter a bug or have a suggestion for improvement of code or to add a feature, then create a issue with proper title and tags but first make sure it's not already present.

## Running tests

To run the tests:
`npm run test`

Please note that running the tests requires a database and Redis. The tests will overwrite and delete a bunch of data so it is advised to make sure you have nothing important inside Redis before running the tests. 

You can supply a different connection URL for the test database via the env variable `TEST_DBSTRING`

### Making a PR


* Fork the repo. This will create a copy of the current repository that you can edit and make changes to.

* Clone it on your machine. But first navigate to your forked repo and then, there you will find link provided by GitHub to clone.

* Add a upstream link to main branch in your cloned repo
    ```
    git remote add upstream https://github.com/CatalysmsServerManager/7-days-to-die-server-manager.git
    ```
* Keep your cloned repo upto date by pulling from upstream (this will also avoid any merge conflicts while committing new changes)
    ```
    git pull upstream main https://github.com/CatalysmsServerManager/7-days-to-die-server-manager.git
    ```
* Create your feature branch
    ```
    git checkout -b <feature-name>
    ```
* Commit all the changes
    ```
    git commit -m "Meaningful commit message"
    ```
* Push the changes for review
    ```
    git push origin <branch-name>
    ```
* Create a PR from your repo on GitHub. Give a proper title and description for the changes you made.

* The maintainer of this repo will review the changes you have made. They will review if your changes are proper or not. If they find any mistakes they may request some changes; in which case, you should make the changes in your forked repository and then commit them. Note: make sure you make changes in the same branch you previously requested PR from.

* At last if maintainers think your PR is proper and correct then your request will be approved and will be merged.

### References
  This document was adapted from the https://github.com/Py-Contributors/awesomeScripts/blob/master/CONTRIBUTING.md.
