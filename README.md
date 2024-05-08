# Example worker + R2 multipart upload 

See my ![blog post](https://notjoemartinez.com/blog/cloudflare_r2_multipart_upload_s3sdk/) for more information.

This is a simple vanilla js example of a cloudflare worker 
that uses the aws-sdk to upload multipart files to upload 
large files to a R2. I've also included a simple html 
file to demonstrate how to create a client side form that 
uploads files using the worker.

You might find this useful if you plan on uploading 
files larger than 5GB to R2.


### insallation
```
git clone https://github.com/NotJoeMartinez/example-r2-multipart-upload
cde example-r2-multipart-upload
npm install
npx wrangler dev 
```

**No authenction is implemented in this example.** 