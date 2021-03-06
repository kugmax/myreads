import { apiEndpoint } from '../config'
import { UserBook } from '../model/UserBook';
import Axios from 'axios'
import { SaveBookRequest } from './request/SaveBookRequest';
import {UserBookReport} from "../model/UserBookReport";
import {mockUserBook_1, mockUserBookReport} from "../__mocks__/api/books-api-mock";
import {RateBookRequest} from "./request/RateBookRequest";

const USE_MOCK = false;

export async function getBooks(idToken: string, limit: number = 5, nextKey?: string): Promise<UserBookReport> {
  if ( USE_MOCK ) {
    return mockUserBookReport;
  }

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
  if ( USE_MOCK ) {
    return mockUserBook_1;
  }

  const response = await Axios.post(`${apiEndpoint}/books`,  JSON.stringify(newBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  return response.data.book
}

export async function updateBook(
    idToken: string,
    bookId: string,
    newBook: SaveBookRequest
): Promise<UserBook> {
  if ( USE_MOCK ) {
    return mockUserBook_1;
  }

  const response = await Axios.patch(`${apiEndpoint}/books/${bookId}`,  JSON.stringify(newBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  return response.data.book
}

export async function rateBook(
    idToken: string,
    bookId: string,
    newRating: RateBookRequest
): Promise<number> {
  if ( USE_MOCK ) {
    return 3;
  }

  const response = await Axios.patch(`${apiEndpoint}/books/${bookId}/rateBook`,  JSON.stringify(newRating), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  return response.data.book
}

export async function getBook(
    idToken: string,
    bookId: string
): Promise<UserBook> {
  if ( USE_MOCK ) {
    return mockUserBook_1;
  }

  const response = await Axios.get(`${apiEndpoint}/books/${bookId}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  return response.data.book
}

export async function deleteBook(
    idToken: string,
    bookId: string
): Promise<void> {
  if ( USE_MOCK ) {
    return;
  }

  await Axios.delete(`${apiEndpoint}/books/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
    idToken: string,
    bookId: string
): Promise<string> {
  if ( USE_MOCK ) {
    return "https://google.com";
  }

  const response = await Axios.post(`${apiEndpoint}/books/${bookId}/cover`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: File): Promise<void> {
  if ( USE_MOCK ) {
    return;
  }

  await Axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type
    }
  })
}