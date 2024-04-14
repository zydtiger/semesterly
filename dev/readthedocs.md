# Documentation Quiz

Please visit the [docs](https://semesterly-v2.readthedocs.io/en/latest/index.html) and
answer the following questions.

1. What is the command I run to get the courses from Fall 2021?

First acquire an API key from SIS, and add to dev_credentials.py. Then run python manage.py ingest jhu --years 2021 --terms Fall

2. How do I then load those courses into my database?

python manage.py digest jhu

3. How do I get a terminal running in my docker container?

Right click on any container and press attach shell.


4. Where do I store data such as passwords or secrets that I don’t want to commit?

Add the keys only to semesterly/dev_credentials.py, under SCRETS.


5. What branch do I create a new branch off of when developing?

/develop

6. If I want to start on a feature called myfeature, what should the branch name be?

feature/myfeature

7. What is the preferred format for commit messages?

git commit -m "Topic: Message"
Messages should be in the imperative mood,
and try to keep commits to “one” change at a time and commit often.

8. What linters do we run against our code?

ESlint style guideline for JS and TS
pycodestyle for Python

9. What is a FeatureFlowView?

It is a class in timetable.utils to handle users' requests into a home timetable page. The data that the frontend requires is retrieved/calculated inside of FeatureFlowView, and then passed to the frontend as global variable initData

When you are done answering the questions, create a PR for a discussion of your answers.