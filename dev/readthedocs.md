# Documentation Quiz

Please visit the [docs](https://semesterly-v2.readthedocs.io/en/latest/index.html) and
answer the following questions.

1. What is the command I run to get the courses from Fall 2021?
`python manage.py ingest jhu --years 2021 --terms Fall`.

2. How do I then load those courses into my database?
`python manage.py digest jhu`.

3. How do I get a terminal running in my docker container?
`docker exec -it <container-id> /bin/bash` or use Docker Desktop.

4. Where do I store data such as passwords or secrets that I don’t want to commit?
They should be stored in dev/sensitive.py, which is automatically ignored.

5. What branch do I create a new branch off of when developing?
Branch off `develop`.

6. If I want to start on a feature called myfeature, what should the branch name be?
The name should be `feature/myfeature`.

7. What is the preferred format for commit messages?
The commit format should be "Topic: Message".

8. What linters do we run against our code?
ESLint style guideline with Prettier for JS/TS and pycodestyle style guide with black for Python.

9. What is a FeatureFlowView?


When you are done answering the questions, create a PR for a discussion of your answers.
