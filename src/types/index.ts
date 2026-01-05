// ✅Tsの型定義は;で区切る

export interface GooglePlacesSearchApiResponse {
  places?: PlaceSearchResult[];
}

export interface PlaceSearchResult {
  id: string;
  // idは必ず取得できるので、'?'をつけない
  displayName?: {
    languageCode?: string;
    text?: string;
  }
  primaryType?: string;
  photos?: PlacePhoto[];
}

export interface PlacePhoto {
  name?: string;
}


export interface Restaurant {
  id: string;
  restaurantName?: string;
  primaryType?: string;
  photoUrl: any;
}

export interface GooglePlacesAutoCompleteResponse {
  suggestions?: PlacesAutoCompleteResult[];
}

export interface PlacesAutoCompleteResult {
  placePrediction?: {
    place?: string;
    placeId?: string;
    structuredFormat?: {
      mainText?: {
        text?: string;
      };
      secondaryText?: {
        text?: string;
      }
    }
  };
  queryPrediction?: {
    text?: {
      text?: string;
    }
  }
}

export interface GooglePlacesAutoDetailsApiResponse {
  location?: {
    latitude?: number;
    longitude?: number;
  }
  displayName?: {
    text?: string;
    languageCode?: string;
  }
  primaryType?: string;
  photos?: PlacePhoto[];
}

export interface placeDetailsAll {
  location?: {
    latitude?: number;
    longitude?: number;
  }
  displayName?: string;
  primaryType?: string;
  photoUrl?: string
}


export interface RestaurantSuggestion {
  type: string;
  placeId?: string;
  // queryPredictionの場合はplaceIdは存在しないので?を付ける
  placeName: string;
}

export interface AddressSuggestion {
  placeId: string;
  placeName: string;
  address_text: string;
}

export interface Address {
  id: number;
  name: string;
  address_text: string;
  latitude: number;
  longitude: number;
}

export interface categoryMenu {
  categoryName: string;
  id: string;
  items: Menu[];
}

export interface Menu {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
}