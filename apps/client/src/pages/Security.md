# Security

## Does bundle-analyzer store passwords?

We do not store any password to analyze your bundle, and will **never** ask you for passwords.

## Will my projects still be private?

Yes your project stays private. Bundle Analyzer uses GitHub App with fine grained permissions, you can choose to give access only to a specific repository. Public projects stats are visible for everyone, private projects are only visible for project users.

## I want to remove the access of a user. How do I do?

As the users rights on Bundle Analyzer are the same as in GitHub, you can change or remove the access of a user directly in GitHub.

## How are the users tokens stored?

User token are stored in our database, your token can be revoked directly from GitHub any time.

## Does Bundle Analyzer have access to my projects source code ?

Yes, we do have access to your projects source code in read-only. We need this access to read commit informations, we will **never** store or scan your code. The project is open source, see by yourself!

## Are my reports stored anywhere?

Your report are stored on a AWS S3 Bucket, the Bucket is private, we generate signed link only for authenticated users.
