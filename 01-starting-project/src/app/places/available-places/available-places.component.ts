import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent]
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  // fallback for fetching data
  isFetching = signal(false);
  error = signal(''); // stores the error message

  // send an HTTP request; a service provided by Angular that helps send an http request and its responses
  private placesService = inject(PlacesService);
  // use destroyRef to unsubscribe from the http subscription
  private destroyRef = inject(DestroyRef);

  // used to fetch the 'places' data from the backend so its available from the start of lanuching the website
    // ngOnInit() executes right when the application is ready
    // this sends a 'get' request to the backend URL that we've provided (subscribe() to trigger the request)
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = 
    this.placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        // set the ACTUAL data that is found in the response data (resData)
        this.places.set(places);
      },
      // Angular will now THROW an error if something goes wrong
      error: (error) => {
        console.log(error);
        this.error.set(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });
    // use destroyRef to unsubscribe from the http subscription
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
    .subscribe({
      next: (resData) => console.log(resData),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
