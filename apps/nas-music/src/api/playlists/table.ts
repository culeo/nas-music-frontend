import { requestClient } from '#/api/request';

export namespace PlaylistsApi {
  export interface PageFetchParams {
    page: number;
    page_size: number;
  }
}

async function getPlaylistsApi(params: PlaylistsApi.PageFetchParams) {
  return requestClient.get('/playlists', { params });
}

async function triggerSyncPlaylistsApi() {
  return requestClient.get(`/playlists/sync`);
}

async function getPlaylistSongsApi(
  playlistId: string,
  params: PlaylistsApi.PageFetchParams,
) {
  return requestClient.get(`/playlists/${playlistId}/songs`, { params });
}

export { getPlaylistsApi, getPlaylistSongsApi, triggerSyncPlaylistsApi };
