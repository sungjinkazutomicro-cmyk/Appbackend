// Empties the Face++ FaceSet used by the "one face = one account" check.
// Run this after deleting users, otherwise their old faces would still block
// anyone from registering again with the same face.
//
//   node clear-faces.js
require('dotenv').config();

const KEY = process.env.FACEPP_API_KEY;
const SECRET = process.env.FACEPP_API_SECRET;
const OUTER_ID = process.env.FACESET_OUTER_ID || 'paycst_users';

(async () => {
  if (!KEY || !SECRET) throw new Error('FACEPP_API_KEY / FACEPP_API_SECRET are not set in .env');
  const form = new URLSearchParams({
    api_key: KEY,
    api_secret: SECRET,
    outer_id: OUTER_ID,
    face_tokens: 'RemoveAllFaceTokens',
  });
  const res = await fetch('https://api-us.faceplusplus.com/facepp/v3/faceset/removeface', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const data = await res.json();
  if (!res.ok || data.error_message) {
    if (/FACESET_NOT_FOUND|INVALID_OUTER_ID/i.test(data.error_message || '')) {
      console.log('No FaceSet exists yet - nothing to clear.');
      return;
    }
    throw new Error(data.error_message || 'removeface failed');
  }
  console.log('FaceSet emptied. Faces removed:', data.face_removed);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
