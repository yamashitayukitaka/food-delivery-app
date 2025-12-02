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

export interface GooglePlacesAutoCompleteResponse {
  suggestions?: PlacesAutoCompleteResult[];
}

export interface PlacesAutoCompleteResult {
  placePrediction?: {
    place?: string,
    placeId?: string,
    structuredFormat?: {
      mainText?: {
        text?: string,
      }
    }
  },
  queryPrediction?: {
    text?: {
      text?: string,
    }
  }
}


export interface RestaurantSuggestion {
  type: string,
  placeId: string,
  placeName: string,
}
