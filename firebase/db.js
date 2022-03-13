import { initializeApp, cert, getApp} from 'firebase-admin/app';
import admin from 'firebase-admin'
import {Firestore, getFirestore, Timestamp, FieldValue }from 'firebase-admin/firestore';
import App from 'next/app';
import {Storage} from '@google-cloud/storage';
const cred = "ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAibG4tanVrZWJveCIsCiAgInByaXZhdGVfa2V5X2lkIjogIjBhZTkyMzE5ZmJlMzJiMWZjN2UzMDcwMjYxNTA4MmUzN2NkODlkNTQiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktnd2dnU2tBZ0VBQW9JQkFRRFpURTZac2d2d2tndTVcbk91amJLVjF4SStrMVhHZ081ai8rN2Y3M3plbnFTVXYzK0dRYnFCbHZMZFZqN2l3N3U3RDhVYWJWYksvVnFXcWpcbmpOUGl4UXcrRG1YL1VhRzJreCtZQjRkcTNFOVpOeEZZSEFtc3htUVdZeVREWDZaSkJNOCtCaHFyOTQzVkYvbUJcblR4UE1jZ2FpYTNNN0hxMnExQTBzTkNGS0wyL2FWNUc4c0h5K083emhOUTltd2FGZ2daZEpYbUlxNFlOVTMydUdcbi9Cei92MXJKKzQxYTFrN3RneFNDaHA5eVVTU01tWlEvZXN1Uk83c0RXOThPVXRSbXpwUUFmMnVQZG9CN2NzcUpcbnRvQ3JJUHFtR2piZFMrd0FRb2RqU0tZZ3RpcmdkZnU2THJOSWpCTWNhTHJneWNIanRIV2hzZjNmSUx1WmdVRllcbll4RE0waFFUQWdNQkFBRUNnZ0VBU0l2cFVmYlhkYUhNdURLcXUwQzhLYUhMb2owUG9Lbk9nOVlCWWNvbFprckNcblNpOXJmTEJLall2SHltMGg1MjlxVDFNVFYvM0pWcFFSUGprdUpHK1Uvc0xmMnJYdVAzNHU5aHJOWXlmYWRmYWtcbm03NEFuT1kvVkJvVmxBVERCMjNMb3ZGMnhpTUgvelRaNEFuK21pc1hlL0pUcmxFM3VlakIzUmdxWlJJaFRjdUFcbjZTTElkZzlrdU9XbjE3ZzVZa2pJbTYxeXlKakxyMndrRkdacEdaQ2s4RTljRk1kMHVZeGdmSElHZmpiZ0YxbVpcbnJ2bUdhVGZ6YTJTVlFoUmtsWE5wQVdBN3REUk1WSmJiUTVNRjZFUmJWQ3pYKzRaZUkvSXJsZ0RRVk45YythbVFcbjMwU1FmTGZ3dU9WSm9ScWYzSXREd0VKME56MjkwU1hscTI1ZTRXSFFRUUtCZ1FENVh2N01ycnFSUGVuYnllcTFcbjU2MmVZVW4yOVBBVDRZdHM5dHoxcFFGeU5MWnpVOW1KbmJaOWk5Y2VxSG9Jbk81RjByRjZSaGV4dFNwM1VvWFhcblA0K2x5ZTlDVVdmbEtKQ0tFS21INW9ZbVlrSmNEaFEwYVpYS25XK3h4THVZSWcvRFI0NjBFNldtdDJ1emFHRjBcbmFrbGhhMlUvZ2RLZG1CLy8rOTJmTGY4Q2h3S0JnUURmRXd6dU03cmoxNWJTckJpRmdybHpBUmdXVmttT3plKzBcbnpIY3JHVXREcFdtbUFiUk9QU2piWUcwQy9EcUlvTlpCNENqU1ZueFhoR05oZWxxZm43WUNkL25mRHVIRDc3ajVcbnJvUmp6eisyZmxlU2M0SHNja0taUzcxY2tKWWVBcjdVMkpaRDVTV0tia2M1d000aE5lVWh2anJvTHpyMm5MY0NcbkVqOS9HaGJwRlFLQmdRRGYyN2RBWjFwMEovQlhyZHRWa0xUN0NMc3RScFIrUkdxMVZxYmtuVXUvQ2pML05MYUVcbkkyQS9NOW5aVzhTeEZxK1BYcVNUNzNnMXZ6eHdBVlRFOWZvdUNpa09qNldFd2ZWKys1WTB1V3lUNklGSndobkJcbk0wZVVxK0FvNVVMQ1AxR0hMQ1dlNGtSQ2RVWHB1RHBFRjJYb1hsQjF3a1VmMUFCbCsrUG5rWkxxNFFLQmdCUE9cbmdqaG9PWERmaEpIQ0hBOUdzeWFsOHppUWdzbCtPWWxwR2krbWVFdFNWWllhMHFLYnhaUHM5T0R0K2xpRlIyRGtcbkFWdmp0L2loVloyakdvYlB6SDVkbnI4U2VETklocmtNcU02ZjZUMVA3SUNoWnVqU29GMHlIMmNubzF5WXk4N2tcblNEdFJEa3REVFdtd1Y5MFZCdm8vQk1YMjQ1cGdBZFBhUU84Tkp2bWRBb0dCQU5LS2tPRi9aQzBkcFhkYlU3eUtcbmxDUFJGTkFsV2pBUUliQldwQTBDcDJzQnJ5T0E3akJDYmE2eWJwSDc4S2N5cHRBNzZ4WlRZQ3d4WlNsZGtmVG9cbjIvUG1zeXNQK2d4cHF5Kzd4RnFVejllYXFoMWYvR0pTQmd3WFFZMUFJb21RY0kzNjZvdXhoRTNKRjFLMFhUVGJcblgzU29BdnNPTFRnNGN3cHhMdGRSTWJ5ZlxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImxuLWp1a2Vib3hAbG4tanVrZWJveC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgImNsaWVudF9pZCI6ICIxMTMzNzEzNTc0NjYwNDA3NjY2MTAiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2xuLWp1a2Vib3glNDBsbi1qdWtlYm94LmlhbS5nc2VydmljZWFjY291bnQuY29tIgp9Cg=="
const credential = JSON.parse(
  Buffer.from(cred, 'base64').toString()
);


try {
  getApp();
} catch (e) {
  initializeApp({credential: cert(credential)});
}

const db = new Firestore({
  projectId: "ln-jukebox",
  credentials: credential 
});

const storage = new Storage({
  projectId: "ln-jukebox",
  credentials: credential 
})


export {
  db,
  storage
};