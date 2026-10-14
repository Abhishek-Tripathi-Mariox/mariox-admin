export const S3Config = {
  Bucket: import.meta.env.VITE_S3_BUCKET,
  Region: import.meta.env.VITE_S3_REGION,
  AccessKey: import.meta.env.VITE_S3_ACCESS_KEY,
  SecretKey: import.meta.env.VITE_S3_SECRET_KEY,
};
