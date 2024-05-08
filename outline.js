import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";


export default {
	async fetch(request, env, ctx) {

    const url = new URL(request.url);
    const base = url.pathname.split('/').slice(1)[0];

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS, PUT",
      "Access-Control-Allow-Headers": "*",
    }

    const S3 = new S3Client({
        region: "auto",
        endpoint: env.CF_ENDPOINT,
        credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
        },
    });


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

}


async function uploadPart(S3, request, headers) {

}


async function getMultiPartUpload(S3, request, headers) {

};

