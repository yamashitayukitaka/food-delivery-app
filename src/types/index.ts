export interface GooglePlacesSearchApiResponse {
  places?: PlaceSearchResult[],
}

export interface PlaceSearchResult {
  id: string,
  // idは必ず取得できるので、'?'をつけない
  displayName?: {
    languageCode?: string,
    text?: string,
  }
  primaryType?: string,
  photos?: PlacePhoto[],
}

export interface PlacePhoto {
  name?: string,
}


export interface Restaurant {
  id: string,
  restaurantName?: string,
  primaryType?: string,
  photoUrl: any,
}