import { apiEndpoint } from '../config'
import { UserBook } from '../model/UserBook';
import Axios from 'axios'
import { SaveBookRequest } from './request/SaveBookRequest';
import {UserBookReport} from "../model/UserBookReport";

export async function getBooks(idToken: string, limit: number = 5, nextKey?: string): Promise<UserBookReport> {
  console.log('Fetching books');

  let query = `?limit=${limit}` + (nextKey ? `&nextKey=${nextKey}` : ``);

  const response = await Axios.get(`${apiEndpoint}/books` + query, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  });
  console.log('Books:', response.data);
  return response.data;
}

export async function saveBook(
    idToken: string,
    newBook: SaveBookRequest
): Promise<UserBook> {
  const response = await Axios.post(`${apiEndpoint}/books`,  JSON.stringify(newBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  //TODO: here need to check at empty response
  return response.data.book
}

export async function deleteBook(
    idToken: string,
    bookId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/books/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

// export async function getUploadUrl(
//     idToken: string,
//     bookId: string
// ): Promise<string> {
//   const response = await Axios.post(`${apiEndpoint}/books/${bookId}/cover`, '', {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${idToken}`
//     }
//   })
//   return response.data.uploadUrl
// }
//
// export async function uploadFile(uploadUrl: string, file: Buffer, fileType: string): Promise<void> {
//   await Axios.put(uploadUrl, file, {
//     headers: {
//       'Content-Type': fileType
//     }
//   })
// }