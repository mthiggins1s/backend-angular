import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
    // fallback for fetching data
    isFetching = signal(false);
    error = signal(''); // stores the error message
  
    // send an HTTP request; a service provided by Angular that helps send an http request and its responses
    private httpClient = inject(HttpClient);
  
    // use destroyRef to unsubscribe from the http subscription
    private destroyRef = inject(DestroyRef);


  ngOnInit() {
      this.isFetching.set(true);
      const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places')
      .pipe(
        map((resData) => resData.places), catchError((error) => throwError(() => new Error('Something went wrong fetching the your favorite places. Please try again later!')))
      )
      .subscribe({
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
      })
    }
}
