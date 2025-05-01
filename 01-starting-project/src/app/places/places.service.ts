import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient)

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Something went wrong fetching the available places. Please try again later');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Something went wrong fetching your favorite places. Please try again later');
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient.put('http://localhost:3000/user-places', {
      placeId,
    });
  }

  removeUserPlace(place: Place) {}

  // adding a private method so we CANNOT use it outside of this service
  private fetchPlaces(url: string, errorMessage: string) {
    return this.httpClient.get<{ places: Place[] }>(url)
      .pipe(
        map((resData) => resData.places), catchError((error) => throwError(() => new Error(errorMessage)))
      )
  }
}
