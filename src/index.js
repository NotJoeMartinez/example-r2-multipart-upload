/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";


export default {
	async fetch(request, env, ctx) {

    const url = new URL(request.url);
    const base = url.pathname.split('/').slice(1)[0];

    console.log('base', base);

    const S3 = new S3Client({
        region: "auto",
        endpoint: env.CF_ENDPOINT,
        credentials: {
        accessKeyId: env.CF_R2_ACCESS_KEY_ID,
        secretAccessKey: env.CF_R2_SECRET_ACCESS_KEY,
        },
    });


    if (request.method === 'get') {

    } else if (request.method === 'post') {

    } else {

    }

	},
};



async function completeMultipartUpload(S3, request) {

  console.log('from completeMultipartUpload');
  let headers = getHeaders();
  headers['Content-Type'] = 'application/json';

  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const bucket = params.get('bucket');
    const key = params.get('key');
    const uploadId = params.get('uploadId');

    console.log('bucket', bucket);
    console.log('key', key);
    console.log('uploadId', uploadId);


    const partsData = await request.json();
    console.log('partsData', partsData);
    const parts = partsData.parts;  
    console.log('parts', parts);

    const input = {
      "Bucket": bucket,
      "Key": key,
      "UploadId": uploadId,
      "MultipartUpload": {
        "Parts": parts 
      }
    }

    console.log('input', input);

    // mutlipart upload parts 
    const command = new CompleteMultipartUploadCommand(input);
    const response = await S3.send(command);

    return new Response(JSON.stringify({
      msg: 'Complete multipart upload command response!',
      response: response
    }), {
      status: 200,
      headers: headers
    });

  } catch (err) {
    console.log('Error', err);
    return new Response(JSON.stringify({
      msg: 'Error, Failed to complete multipart upload!',
      error: JSON.stringify(err) 
    }), {
      status: 500,
      headers: headers
    });
  }
}


async function uploadPart(S3, request) {
  let headers = getHeaders();
  headers['Content-Type'] = 'application/json';

  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const bucket = params.get('bucket');
    const key = params.get('key');
    const partNumber = params.get('partNumber');
    const uploadId = params.get('uploadId');


    const formData = await request.formData();
    const fileData = formData.get('file');

    console.log('fileData', fileData);

    const input = {
      "Body": fileData, // use the actual file data
      "Bucket": bucket,
      "Key": key,
      "PartNumber": partNumber,
      "UploadId": uploadId
    };

    const command = new UploadPartCommand(input);
    const response = await S3.send(command);

    return new Response(JSON.stringify({
      msg: 'Upload part command response!',
      response: response
    }), {
      status: 200,
      headers: headers
    });

  } catch (err) {
    console.log('Error', err);
    return new Response(JSON.stringify({
      msg: 'Error, Failed to upload part!',
      error: err
    }), {
      status: 500,
      headers: headers
    });
  }
}


async function getMultiPartUpload(S3, request) {
  let headers = getHeaders();
  headers['Content-Type'] = 'application/json';
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    const bucket = params.get('bucket');
    const key = params.get('key');

    console.log('bucket', bucket);
    console.log('key', key);

    const command = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key
    });

    console.log('command', command);
    const response = await S3.send(command);

    return new Response(JSON.stringify({
      msg: 'Create Multipart upload command response!',
      response: response
    }), {
      status: 200,
      headers: headers
    });
  
  } catch (err) {
    console.log('Error', err);
    return new Response(JSON.stringify({
      msg: 'Error, Failed to get multipart upload signed url!',
      error: err
    }), {
      status: 500,
      headers: headers
    });
  }
};


function getHeaders() {
  let corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
      "Access-Control-Allow-Headers": "*",
  }
  return corsHeaders;
}


function get404Response() {
  let headers = getHeaders();
  headers['Content-Type'] = 'application/json';
  headers['status'] = 404;
  return new Response(JSON.stringify(
      { 
          msg: '404 page not found!' 
      }), 
      { 
          headers: headers 
      });
}