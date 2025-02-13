import supabase from '@/config/supabase';

const createBucketIfNotExists = async (bucketName) => {
  const { data, error } = await supabase.storage.getBucket(bucketName);

  if (error) {
    console.log(`"${bucketName}" 버킷이 존재하지 않음. 새로 생성합니다.`);
    await supabase.storage.createBucket(bucketName, { public: false });
  } else {
    console.log(`"${bucketName}" 버킷이 이미 존재함.`);
  }
};
export { createBucketIfNotExists };
