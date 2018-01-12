import { endpoint } from 'src/app/api';
import asyncActionCreator from './asyncActionCreator';

export const fetchMetadata = asyncActionCreator(() => async dispatch => {
  const response = await endpoint.get('metadata');
  return { metadata: response.data };
}, { name: 'FETCH_METADATA' });

export const fetchStatistics = asyncActionCreator(() => async dispatch => {
    const response = await endpoint.get('statistics');
    return { statistics: response.data };
}, { name: 'FETCH_STATISTICS' });

export const fetchSearchResults = asyncActionCreator(({ filters }) => async dispatch => {
  const response = await endpoint.get('search', { params: filters });
  return { filters, result: response.data };
}, { name: 'FETCH_SEARCH_RESULTS' });

export const fetchTabularResults = asyncActionCreator(({ documentId }) => async dispatch => {
    const response = await endpoint.get(`/documents/${documentId}/records`);
    return { cells: response.data };
}, { name: 'FETCH_TABULAR_RESULTS' });

export const fetchNextSearchResults = asyncActionCreator(({ next }) => async dispatch => {
  const response = await endpoint.get(next);
  return { result: response.data };
}, { name: 'FETCH_NEXT_SEARCH_RESULTS' });

export const fetchEntity = asyncActionCreator(({ id }) => async dispatch => {
  const response = await endpoint.get(`entities/${id}`);
  return { id, data: response.data };
}, { name: 'FETCH_ENTITY' });

export const fetchDocument = asyncActionCreator(({ id }) => async dispatch => {
  const response = await endpoint.get(`documents/${id}`);
  return { id, data: response.data };
}, { name: 'FETCH_DOCUMENT' });

export const fetchCollection = asyncActionCreator(({ id }) => async dispatch => {
  const response = await endpoint.get(`collections/${id}`);
  return { id, data: response.data };
}, { name: 'FETCH_COLLECTION' });

export const fetchCollections = asyncActionCreator(({ filters }) => async dispatch => {
  const response = await endpoint.get('collections', { params: filters });
  return { filters, result: response.data };
}, { name: 'FETCH_COLLECTIONS' });
