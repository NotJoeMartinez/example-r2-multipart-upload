# Example worker + R2 multipart upload 
**work in progress**

This is a simple vanilla js example of a cloudflare worker 
that uses the aws-sdk to upload multipart files to upload 
large files to a R2. I've also included a simple html 
file to demonstrate how to create a client side form that 
uploads files using the worker.

You might find this useful if you plan on uploading 
files larger than 5GB to R2.


### insallation
```
npm install @aws-sdk/client-s3
```