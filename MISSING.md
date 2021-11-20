# Items Missing from the assignment

# Unit Tests
I'm not as familiar with unit testing React and using Jest or Enzyme. I'm very familiar with Karma, Jasmine, and Sinon.
I would add full coverage unit test coverage.

# CICD
For the CICD I would use Github Actions.
1. Every pull request the gets opened would run the unit test code linting jobs. PRs would not be able to be merged unless those steps passed.

2. Every PR that gets merged to the main branch would kick off Amazon Code Deploy with would deploy the code to the EC2 Instance.


# Observability
I would install Grafana to keep track of performance metrics on the EC2 instance over time. I would like to see if a single EC2 instance can handle the load of our current use case. I would also like to keep the logs I generate in cold storage for auditing purposes so I would use Cribl to direct my most imporatn logs to S3.




# Improvements
1. I would like to tinker more with different chunk sizes for the file uploads to see which is most effective.
2. I would add a login and if you are a customer you would only have access to the upload page and if you are a support engineer you can only access the file list page.
3. I would style the frontend so it is more pleasing.'
4. I would add retry logic into the file upload and downloads so the process are more resilient.
