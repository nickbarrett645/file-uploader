
# Users
1. Customer
2. Support Engineer

# Stakeholders
1. Customers
2. Support Engineer
3. SRE
4. Company

# Stories
1. As a customer I want to be able to upload my diagnostic bundle to the support portal.
2. As a customer I want to know if my file uploaded successfully.
3. As a customer I want to know if my file failed to upload.
4. As a customer I want to upload files quickly.
5. As a support engineer I want to see a list of uploaded files and their metadata.
6. As a support engineer I want to be able to download files.
7. As a support engineer I want to know why a file did not download successfully.
8. As a support engineer I want to download files quickly.
9. As an SRE I want to see observabiliy data so I monitor the application.
10. As an SRE I want non ".tgz" files to be prevented from being uploaded to reduce load on the system.
11. As the company the want the solution to be cost effective.


# Performance
Performance is the biggest issue.
Needs to handle uploading and downloading multiple large files at a time.
Backend should ultimately be a pass through. Should not write anything to disk.


# Upload Download Solution
Files being uploaded and donwlonad should be sent in chunks so that nothing is written to disk.
Each call should be independent.
S3 MultiPart Upload and Byte Range download

# Drawbacks
More network traffic
More calls more room for error

# Positives
Ability to do retries when uploading large files
low resources needed on EC2