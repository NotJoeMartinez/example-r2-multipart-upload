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
        console.log('from getMultiPartUpload');
        return getMultiPartUpload(S3, request);
      }
    } 

    if (request.method === 'POST') {
      if (base === 'uploadPart') {
        return uploadPart(S3, request);
      } 
      if (base === 'completeMultipartUpload') {
        return completeMultipartUpload(S3, request);  
      }
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
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
        "Access-Control-Allow-Headers": "*",
    }
}
