import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";


export default {
	async fetch(request, env, ctx) {


    const headers =  {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
      "Access-Control-Allow-Headers": "*"
    }

    const S3 = new S3Client({
        region: "auto",
        endpoint: env.CF_ENDPOINT,
        credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
    });


    const url = new URL(request.url);
    const base = url.pathname.split('/').slice(1)[0];

    if (request.method === 'GET') {
      if (base === 'getMultiPartUpload') {
        return getMultiPartUpload(S3, request, headers);
      }
    } 

    if (request.method === 'POST') {
      if (base === 'uploadPart') {
        return uploadPart(S3, request, headers);
      } 
      if (base === 'completeMultipartUpload') {
        return completeMultipartUpload(S3, request, headers);  
      }
    }
	},
};



async function completeMultipartUpload(S3, request, headers) {

  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const bucket = params.get('bucket');
    const key = params.get('key');
    const uploadId = params.get('uploadId');

    const partsData = await request.json();
    const parts = partsData.parts;  

    const input = {
      "Bucket": bucket,
      "Key": key,
      "UploadId": uploadId,
      "MultipartUpload": {
        "Parts": parts 
      }
    }

    const command = new CompleteMultipartUploadCommand(input);
    const response = await S3.send(command);

    return new Response(JSON.stringify({
      msg: '/completeMultipartUpload',
      response: response
    }), {
      status: 200,
      headers: headers
    });
  } catch (err) {
    return new Response(JSON.stringify({
      msg: 'Error: /completeMultipartUpload',
      error: JSON.stringify(err) 
    }), {
      status: 500,
      headers: headers
    });
  }
}


async function uploadPart(S3, request, headers) {

  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const bucket = params.get('bucket');
    const key = params.get('key');
    const partNumber = params.get('partNumber');
    const uploadId = params.get('uploadId');


    const formData = await request.formData();
    const fileData = formData.get('file');

    const input = {
      "Body": fileData, 
      "Bucket": bucket,
      "Key": key,
      "PartNumber": partNumber,
      "UploadId": uploadId
    };

    const command = new UploadPartCommand(input);
    const response = await S3.send(command);

    return new Response(JSON.stringify({
      msg: 'Success: /uploadPart',
      response: response
    }), {
      status: 200,
      headers: headers
    });

  } catch (err) {
    return new Response(JSON.stringify({
      msg: 'Error: /uploadPart',
      error: err
    }), {
      status: 500,
      headers: headers
    });
  }
}


async function getMultiPartUpload(S3, request, headers) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const bucket = params.get('bucket');
    const key = params.get('key');

    const command = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key
    });

    const response = await S3.send(command);

    return new Response(JSON.stringify({
      msg: 'Success: /getMultiPartUpload',
      response: response
    }), {
      status: 200,
      headers: headers
    });
  
  } catch (err) {
    return new Response(JSON.stringify({
      msg: 'Error: /getMultiPartUpload',
      error: err
    }), {
      status: 500,
      headers: headers
    });
  }
};
